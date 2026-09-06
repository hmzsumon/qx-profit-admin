'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import socketUrl from '@/config/socketUrl'; // ✅ Use dedicated socket URL
import { apiSlice } from '@/redux/features/api/apiSlice';
import { SocketUser } from '@/types';

/* admin notify sound — on by default, muted via localStorage */
function playAdminNotifySound() {
	try {
		if (localStorage.getItem('qx_admin_notif_sound') === '0') return;
		const a = new Audio('/sounds/notify.wav');
		a.volume = 0.6;
		void a.play().catch(() => {});
	} catch {
		/* autoplay blocked */
	}
}

interface iSocketContextType {
	socket: Socket | null;
	isSocketConnected: boolean;
	onlineUsers: SocketUser[]; // Optional
}

export const SocketContext = createContext<iSocketContextType | null>(null);

export const SocketContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { user } = useSelector((state: any) => state.auth);
	const dispatch = useDispatch();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isSocketConnected, setIsSocketConnected] = useState(false);
	const [onlineUsers, setOnlineUsers] = useState<SocketUser[]>([]);

	useEffect(() => {
		if (!user || !user._id) return;

		// ✅ No token passed
		const newSocket = io(socketUrl, {
			transports: ['websocket'],
		});

		newSocket.on('connect', () => {
			console.log('✅ Socket connected:', newSocket.id);
			newSocket.emit('join-room', user._id); // Join user's room
			setSocket(newSocket);
			setIsSocketConnected(true);
		});

		newSocket.on('disconnect', () => {
			console.log('🔴 Socket disconnected');
			setIsSocketConnected(false);
		});

		return () => {
			newSocket.disconnect();
			setSocket(null);
			setIsSocketConnected(false);
		};
	}, [user?._id]);

	useEffect(() => {
		if (!socket) return;

		const onUsers = (users: SocketUser[]) => setOnlineUsers(users);

		const onAdminNotif = (evt: { message?: string; title?: string }) => {
			dispatch(apiSlice.util.invalidateTags(['AdminNotifications']));
			const text = evt?.message || evt?.title || 'New activity';
			toast(text, { icon: '🔔' });
			playAdminNotifySound();
		};

		// canonical event does the cache refresh; `admin-notification` shows the toast
		const onNotificationNew = () => {
			dispatch(apiSlice.util.invalidateTags(['AdminNotifications']));
		};

		socket.on('getUsers', onUsers);
		socket.on('admin-notification', onAdminNotif);
		socket.on('notification:new', onNotificationNew);

		return () => {
			socket.off('getUsers', onUsers);
			socket.off('admin-notification', onAdminNotif);
			socket.off('notification:new', onNotificationNew);
		};
	}, [socket, dispatch]);

	return (
		<SocketContext.Provider value={{ socket, isSocketConnected, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return context;
};

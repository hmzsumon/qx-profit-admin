'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import socketUrl from '@/config/socketUrl'; // ✅ Use dedicated socket URL
import { SocketUser } from '@/types';

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

		socket.on('getUsers', (users: SocketUser[]) => {
			setOnlineUsers(users);
		});

		return () => {
			socket.off('getUsers');
		};
	}, [socket]);

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

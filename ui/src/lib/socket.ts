import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinDashboard(dashboardSlug: string) {
    this.socket?.emit('join-dashboard', dashboardSlug);
  }

  leaveDashboard(dashboardSlug: string) {
    this.socket?.emit('leave-dashboard', dashboardSlug);
  }

  emitComponentUpdate(dashboardSlug: string, componentId: string, changes: any) {
    this.socket?.emit('component-update', { dashboardSlug, componentId, changes });
  }

  onComponentUpdated(callback: (data: any) => void) {
    this.socket?.on('component-updated', callback);
  }

  emitCursorMove(dashboardSlug: string, position: { x: number; y: number }, user: string) {
    this.socket?.emit('cursor-move', { dashboardSlug, position, user });
  }

  onCursorMoved(callback: (data: any) => void) {
    this.socket?.on('cursor-moved', callback);
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();

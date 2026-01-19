import React, { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { GameStatus } from '../types';

type UserRow = {
  id: string;
  email: string;
  name: string;
};

type ProgressRow = {
  user_id: string;
  game_id: number;
  status: GameStatus;
};

interface Props {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, name');

      if (usersError) {
        console.error('Failed to load users', usersError);
        setLoading(false);
        return;
      }

      const { data: progressData, error: progressError } = await supabase
        .from('game_progress')
        .select('user_id, game_id, status');

      if (progressError) {
        console.error('Failed to load progress', progressError);
        setLoading(false);
        return;
      }

      setUsers(usersData || []);
      setProgress(progressData || []);
      setLoading(false);
    };

    loadData();
  }, []);

  const totalUsers = users.length;
  const totalAttempts = progress.length;
  const totalWins = progress.filter(p => p.status === GameStatus.WON).length;

  const completedUsers = users.filter(u => {
    const userProgress = progress.filter(p => p.user_id === u.id);
    if (userProgress.length === 0) return false;

    return userProgress.every(p => p.status === GameStatus.WON);
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={totalUsers} />
          <StatCard title="Total Attempts" value={totalAttempts} />
          <StatCard title="Total Wins" value={totalWins} />
          <StatCard title="Fully Completed" value={completedUsers} />
        </div>

        {/* Users table */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Attempts</th>
                <th className="p-3">Wins</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const userProgress = progress.filter(p => p.user_id === u.id);
                const wins = userProgress.filter(p => p.status === GameStatus.WON).length;

                return (
                  <tr key={u.id} className="border-b">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{userProgress.length}</td>
                    <td className="p-3">{wins}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white p-4 rounded shadow">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

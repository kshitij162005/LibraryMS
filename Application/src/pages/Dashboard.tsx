import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';

interface PendingReturn {
  id: string;
  member: {
    name: string;
    email: string;
  };
  book: {
    title: string;
  };
  due_date: string;
}

const Dashboard = () => {
  console.log('Dashboard component loaded');
  
  const [pendingReturns, setPendingReturns] = useState<PendingReturn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingReturns = async () => {
      console.log('Fetching pending returns...');
      try {
        const { data, error } = await supabase
          .from('issuances')
          .select(`
            id,
            due_date,
            member:members(name, email),
            book:books(title)
          `)
          .is('return_date', null)
          .order('due_date', { ascending: true });

        if (error) throw error;
        console.log('Pending returns fetched successfully:', data);
        setPendingReturns(data || []);
      } catch (error) {
        console.error('Error fetching pending returns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReturns();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Returns</h2>
        
        {pendingReturns.length === 0 ? (
          <p className="text-muted-foreground">No pending returns for today!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Member</th>
                  <th className="text-left py-3 px-4">Book</th>
                  <th className="text-left py-3 px-4">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {pendingReturns.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50" onClick={() => console.log('Row clicked:', item)}>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{item.member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.member.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.book.title}</td>
                    <td className="py-3 px-4">
                      {format(new Date(item.due_date), 'PPP')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

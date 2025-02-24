import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { Plus, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Member {
  id: string;
  name: string;
  email: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  available_quantity: number;
}

interface Issuance {
  id: string;
  member: {
    name: string;
    email: string;
  };
  book: {
    title: string;
    author: string;
  };
  issue_date: string;
  due_date: string;
  return_date: string | null;
}

interface IssuanceFormData {
  member_id: string;
  book_id: string;
  due_date: string;
}

const Issuances = () => {
  const [issuances, setIssuances] = useState<Issuance[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<IssuanceFormData>({
    member_id: '',
    book_id: '',
    due_date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
  });

  const fetchIssuances = async () => {
    try {
      const { data, error } = await supabase
  .from('issuances')
  .select(`
    id,
    issue_date,
    due_date,
    return_date,
    members!inner(id, name, email),
    books!inner(id, title, author)
  `)
  .order('issue_date', { ascending: false });

  
      if (error) throw error;
  
      const formattedData: Issuance[] = (data || []).map((issuance) => ({
        id: issuance.id,
        issue_date: issuance.issue_date,
        due_date: issuance.due_date,
        return_date: issuance.return_date,
        member: issuance.members,
      book: issuance.books,
      }));
  
      setIssuances(formattedData);
    } catch (error) {
      console.error('Error fetching issuances:', error);
      toast.error('Failed to fetch issuances');
    }
  };
  
  

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, name, email')
        .order('name');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch members');
    }
  };

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author, available_quantity')
        .gt('available_quantity', 0)
        .order('title');

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to fetch books');
    }
  };

  useEffect(() => {
    Promise.all([fetchIssuances(), fetchMembers(), fetchBooks()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error: insertError } = await supabase
        .from('issuances')
        .insert([{
          ...formData,
          issue_date: new Date().toISOString(),
        }]);
  
      if (insertError) throw insertError;
  
      const { error: updateError } = await supabase
        .from('books')
        .update({ available_quantity: supabase.rpc('available_quantity - 1') })
        .eq('id', formData.book_id);
  
      if (updateError) throw updateError;
  
      await Promise.all([fetchIssuances(), fetchBooks()]);
  
      toast.success('Book issued successfully');
  
      // Close modal after successful issuance
      setDialogOpen(false);
      setFormData({
        member_id: '',
        book_id: '',
        due_date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
      });
      window.location.reload();
    } 
    catch (error) {
      console.error('Error issuing book:', error);
      window.location.reload();
    }
  };
  
  const handleReturn = async (issuance: Issuance) => {
    try {
      const { error: updateIssuanceError } = await supabase
        .from('issuances')
        .update({ return_date: new Date().toISOString() })
        .eq('id', issuance.id);
      if (updateIssuanceError) throw updateIssuanceError;

      const { error: updateBookError } = await supabase
        .from('books')
        .update({ available_quantity: supabase.rpc('available_quantity + 1') })
        .eq('title', issuance.book.title);
      if (updateBookError) throw updateBookError;

      toast.success('Book returned successfully');
      await Promise.all([fetchIssuances(), fetchBooks()]);
    } catch (error) {
      console.error('Error returning book:', error);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Issuances</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Issue Book
        </Button>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Member</th>
                <th className="text-left py-3 px-4">Book</th>
                <th className="text-left py-3 px-4">Issue Date</th>
                <th className="text-left py-3 px-4">Due Date</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issuances.map((issuance) => (
                <tr key={issuance.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{issuance.member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {issuance.member.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{issuance.book.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {issuance.book.author}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                  {format(new Date(issuance.issue_date), 'dd/MM/yyyy')}
                  </td>
                  <td className="py-3 px-4">
                    {format(new Date(issuance.due_date), 'PPP')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        issuance.return_date
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                          : new Date(issuance.due_date) < new Date()
                          ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400'
                      }`}
                    >
                      {issuance.return_date
                        ? 'Returned'
                        : new Date(issuance.due_date) < new Date()
                        ? 'Overdue'
                        : 'Borrowed'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {!issuance.return_date && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReturn(issuance)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setFormData({
            member_id: '',
            book_id: '',
            due_date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
          });
        }}
        title="Issue Book"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="member" className="block text-sm font-medium mb-1">
              Member
            </label>
            <select
              id="member"
              value={formData.member_id}
              onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Select a member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="book" className="block text-sm font-medium mb-1">
              Book
            </label>
            <select
              id="book"
              value={formData.book_id}
              onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author} ({book.available_quantity} available)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="due_date" className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <DatePicker
  selected={new Date(formData.due_date)}
  onChange={(date) => setFormData({ ...formData, due_date: format(date!, 'yyyy-MM-dd') })}
  dateFormat="dd/MM/yyyy"
  minDate={new Date()}
  className="w-full rounded-md border border-input bg-background px-3 py-2"
/>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setFormData({
                  member_id: '',
                  book_id: '',
                  due_date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Issue Book </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};


export default Issuances;

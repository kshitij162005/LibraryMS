import React, { useEffect, useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import toast from 'react-hot-toast';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  available_quantity: number;
}

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
}

const logButtonClick = (buttonName: string) => {
  console.log(`[${new Date().toISOString()}] Button Clicked: ${buttonName}`);
};

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    quantity: 1,
  });

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logButtonClick(editingBook ? 'Update Book' : 'Add Book')
    try {
      if (editingBook) {
        const newAvailableQuantity = formData.quantity - (editingBook.quantity - editingBook.available_quantity);
  
        // Prevent available quantity from becoming negative
        if (newAvailableQuantity < 0) {
          toast.error("Cannot reduce quantity below borrowed books");
          return;
        }
  
        const { error } = await supabase
          .from('books')
          .update({
            ...formData,
            available_quantity: newAvailableQuantity,
          })
          .eq('id', editingBook.id);
  
        if (error) throw error;
        toast.success('Book updated successfully');
      } else {
        const { error } = await supabase
          .from('books')
          .insert([{
            ...formData,
            available_quantity: formData.quantity, // Set available to total when adding a new book
          }]);
  
        if (error) throw error;
        toast.success('Book added successfully');
      }
  
      // Close modal & reset form
      setDialogOpen(false);
      setEditingBook(null);
      setFormData({ title: '', author: '', isbn: '', quantity: 1 });
  
      // Fetch updated book list
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error('Failed to save book');
    }
  };
  

  const handleEdit = (book: Book) => {
    logButtonClick('Edit Book');
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      quantity: book.quantity,
    });
    setDialogOpen(true);
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
        <h1 className="text-3xl font-bold">Books</h1>
        <Button onClick={() => { logButtonClick('Add Book'); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Author</th>
                <th className="text-left py-3 px-4">ISBN</th>
                <th className="text-right py-3 px-4">Available</th>
                <th className="text-right py-3 px-4">Total</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{book.title}</td>
                  <td className="py-3 px-4">{book.author}</td>
                  <td className="py-3 px-4">{book.isbn}</td>
                  <td className="py-3 px-4 text-right">{book.available_quantity}</td>
                  <td className="py-3 px-4 text-right">{book.quantity}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(book)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
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
          setEditingBook(null);
          setFormData({ title: '', author: '', isbn: '', quantity: 1 });
        }}
        title={editingBook ? 'Edit Book' : 'Add Book'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-1">
              Author
            </label>
            <input
              type="text"
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="isbn" className="block text-sm font-medium mb-1">
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setEditingBook(null);
                setFormData({ title: '', author: '', isbn: '', quantity: 1 });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingBook ? 'Update' : 'Add'} Book
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Books;
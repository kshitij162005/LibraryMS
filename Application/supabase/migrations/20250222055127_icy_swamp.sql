-- Create members table
CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Create books table
CREATE TABLE books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  isbn text UNIQUE NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  available_quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT quantity_check CHECK (quantity >= 0),
  CONSTRAINT available_quantity_check CHECK (available_quantity >= 0 AND available_quantity <= quantity)
);

-- Create issuances table
CREATE TABLE issuances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  issue_date timestamptz NOT NULL DEFAULT now(),
  due_date timestamptz NOT NULL,
  return_date timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (
    issue_date <= due_date AND
    (return_date IS NULL OR return_date >= issue_date)
  )
);


CREATE FUNCTION decrease_book_quantity(book_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE books SET available_quantity = available_quantity - 1 WHERE id = book_id;
END;
$$ LANGUAGE plpgsql;


-- Disable Row-Level Security (RLS) to allow unrestricted access
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE issuances DISABLE ROW LEVEL SECURITY;

-- Remove any existing RLS policies (if they exist)
DROP POLICY IF EXISTS "Allow authenticated users to read members" ON members;
DROP POLICY IF EXISTS "Allow authenticated users to insert members" ON members;
DROP POLICY IF EXISTS "Allow authenticated users to update members" ON members;

DROP POLICY IF EXISTS "Allow authenticated users to read books" ON books;
DROP POLICY IF EXISTS "Allow authenticated users to insert books" ON books;
DROP POLICY IF EXISTS "Allow authenticated users to update books" ON books;

DROP POLICY IF EXISTS "Allow authenticated users to read issuances" ON issuances;
DROP POLICY IF EXISTS "Allow authenticated users to insert issuances" ON issuances;
DROP POLICY IF EXISTS "Allow authenticated users to update issuances" ON issuances;

-- Create indexes for better performance
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_issuances_member_id ON issuances(member_id);
CREATE INDEX idx_issuances_book_id ON issuances(book_id);
CREATE INDEX idx_issuances_due_date ON issuances(due_date);
CREATE INDEX idx_issuances_return_date ON issuances(return_date);

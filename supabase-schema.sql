-- ================================================================
-- 🗄️ SUPABASE SCHEMA — HailiteManager
-- Copier-coller dans Supabase SQL Editor
-- ================================================================

-- ── Employés ──
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'employee' CHECK (role IN ('employee', 'supervisor', 'admin')),
  hourly_rate DECIMAL(10, 2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ── Projets ──
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ── Entrées de temps (Punch) ──
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  punch_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
  punch_out_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ── Factures ──
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_name TEXT,
  amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5, 2),
  total_with_tax DECIMAL(12, 2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ── Matériaux ──
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  description TEXT,
  unit TEXT DEFAULT 'unité',
  price_tier_1 DECIMAL(10, 2),   -- Prix régulier
  price_tier_2 DECIMAL(10, 2),   -- Prix contracteur
  price_tier_3 DECIMAL(10, 2),   -- Prix volume
  stock_quantity DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ================================================================
-- INDEX POUR PERFORMANCE
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_time_entries_employee_id ON time_entries(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_punch_in ON time_entries(punch_in_time);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- ── Politique Employés ──
-- Admin: voir tous
CREATE POLICY "admin_all_employees" ON employees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid()
      AND e.role IN ('admin', 'supervisor')
    )
  );

-- Employé: voir seulement son profil
CREATE POLICY "employee_own_profile" ON employees
  FOR SELECT USING (user_id = auth.uid());

-- ── Politique Projets (admin seulement) ──
CREATE POLICY "admin_all_projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid()
      AND e.role IN ('admin', 'supervisor')
    )
  );

-- ── Politique Time Entries ──
-- Admin: voir tous
CREATE POLICY "admin_all_time_entries" ON time_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid()
      AND e.role IN ('admin', 'supervisor')
    )
  );

-- Employé: voir seulement les siennes
CREATE POLICY "employee_own_time_entries" ON time_entries
  FOR ALL USING (
    employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );

-- ── Politique Factures (admin seulement) ──
CREATE POLICY "admin_all_invoices" ON invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid()
      AND e.role IN ('admin', 'supervisor')
    )
  );

-- ── Politique Matériaux (admin: tout, employé: lecture) ──
CREATE POLICY "admin_all_materials" ON materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid()
      AND e.role IN ('admin', 'supervisor')
    )
  );

CREATE POLICY "employee_read_materials" ON materials
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ================================================================
-- DONNÉES DE TEST (Optionnel)
-- ================================================================

-- Uncomment to add test data:
-- INSERT INTO projects (name, address, client_name, status, budget) VALUES
--   ('Projet Montréal Centre', '123 Rue Ste-Catherine, Montréal', 'Jean Tremblay', 'in_progress', 15000),
--   ('Toit Laval', '456 Boul. des Laurentides, Laval', 'Marie Côté', 'pending', 8500),
--   ('Rénovation Brossard', '789 Rue Ste-Foy, Brossard', 'Pierre Gagnon', 'completed', 22000);

-- INSERT INTO materials (name, sku, unit, price_tier_1, price_tier_2, price_tier_3) VALUES
--   ('Bardeau asphalte 25 ans', 'SHG-25', 'paquet', 45.99, 39.99, 34.99),
--   ('Sous-couche synthétique', 'UL-SYNTH', 'rouleau', 89.99, 79.99, 69.99),
--   ('Clous coil 1.75"', 'NAIL-175', 'boîte', 28.50, 24.50, 21.00);

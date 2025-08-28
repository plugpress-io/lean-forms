# @lean-forms/ui-components

A collection of reusable ShadCN-based UI components for WordPress admin interfaces.

## Installation

```bash
npm install @lean-forms/ui-components
```

## Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react react-dom @tanstack/react-table lucide-react clsx tailwind-merge class-variance-authority
```

## Setup

### 1. Tailwind CSS Configuration

Add this to your `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@lean-forms/ui-components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

### 2. CSS Variables

Add these CSS variables to your stylesheet:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}
```

## Usage

### Basic Components

```jsx
import { Button, Badge, Input } from '@lean-forms/ui-components';

function MyComponent() {
  return (
    <div>
      <Button variant="default">Click me</Button>
      <Badge variant="success">Success</Badge>
      <Input placeholder="Enter text..." />
    </div>
  );
}
```

### Data Table

```jsx
import { DataTable } from '@lean-forms/ui-components';

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
  },
];

function MyTable({ data }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search..."
    />
  );
}
```

### Table Components

```jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@lean-forms/ui-components';

function CustomTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
```

## Components

### Button
- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- Sizes: `default`, `sm`, `lg`, `icon`

### Badge
- Variants: `default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `info`

### Input
- Standard input field with ShadCN styling

### Table Components
- Complete table system with header, body, rows, cells
- Professional styling and hover states

### DataTable
- Advanced data table with sorting, filtering, pagination
- Built on TanStack React Table
- Search functionality
- Responsive design

## Utilities

### cn()
Utility function for combining class names with Tailwind merge:

```jsx
import { cn } from '@lean-forms/ui-components';

const className = cn("base-class", "conditional-class", {
  "active": isActive
});
```

## License

MIT

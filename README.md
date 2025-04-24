# Project Management Dashboard

A modern, feature-rich project management dashboard built with React, TypeScript, and Vite. This application provides real-time task tracking, employee management, and project oversight capabilities with a sleek, responsive interface.

![Dashboard Preview](public/dashboard-preview.png)

## 🌟 Features

- **Project Management**
  - Create and manage multiple projects
  - Track project timelines and progress
  - Assign team members to projects
  - Project status monitoring

- **Task Tracking**
  - Kanban-style task management
  - Task status updates (Need To Do, In Progress, Need For Test, Completed, ReOpen)
  - Task assignments and deadlines
  - Reference image attachments

- **Employee Management**
  - Employee profiles and roles
  - Skill tracking
  - Project assignments
  - Workload monitoring

- **Real-time Updates**
  - Instant UI updates
  - Progress tracking
  - Status changes reflection

## 🚀 Technologies

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://reactjs.org/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [React Query](https://tanstack.com/query/latest) - Data Fetching
- [React Router](https://reactrouter.com/) - Routing
- [React Hook Form](https://react-hook-form.com/) - Form Management
- [Zod](https://zod.dev/) - Schema Validation

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Prem-Anand-R/project-management-dashboard.git
```

2. Navigate to the project directory:
```bash
cd project-management-dashboard
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run build:dev` - Build for development

## 🏗️ Project Structure

```
src/
├── components/          # UI components
│   ├── Dashboard/      # Dashboard components
│   ├── Employees/      # Employee management
│   ├── Projects/       # Project management
│   ├── Tasks/          # Task management
│   └── ui/             # Reusable UI components
├── context/            # Global state management
├── hooks/              # Custom React hooks
├── lib/               # Utilities and helpers
├── pages/             # Route pages
└── types/             # TypeScript types
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_API_KEY=your_api_key
```

### Tailwind Configuration

Customize the `tailwind.config.ts` file for styling preferences:

```typescript
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Your custom theme
    }
  }
}
```

## 📱 Responsive Design

- Desktop-first approach with mobile responsiveness
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## 🔐 Security

- Input validation using Zod
- Type-safe API calls
- Protected routes
- Secure data storage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGithub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool

## 📞 Support

For support, email support@yourdomain.com or join our Slack channel.

---

Made with ❤️ by [Your Name/Company]


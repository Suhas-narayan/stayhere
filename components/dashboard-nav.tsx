// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import {
//   LayoutDashboard,
//   Home,
//   CalendarDays,
//   BookOpen,
//   Settings,
//   Users,
//   MessageSquare,
//   BarChart,
//   HelpCircle,
// } from "lucide-react"

// const items = [
//   {
//     title: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Properties",
//     href: "/dashboard/properties",
//     icon: Home,
//   },
//   {
//     title: "Bookings",
//     href: "/dashboard/bookings",
//     icon: BookOpen,
//   },
//   {
//     title: "Calendar",
//     href: "/dashboard/calendar",
//     icon: CalendarDays,
//   },
//   {
//     title: "Messages",
//     href: "/dashboard/messages",
//     icon: MessageSquare,
//   },
//   {
//     title: "Guests",
//     href: "/dashboard/guests",
//     icon: Users,
//   },
//   {
//     title: "Analytics",
//     href: "/dashboard/analytics",
//     icon: BarChart,
//   },
//   {
//     title: "Settings",
//     href: "/dashboard/settings",
//     icon: Settings,
//   },
//   {
//     title: "Help",
//     href: "/dashboard/help",
//     icon: HelpCircle,
//   },
// ]

// export function DashboardNav() {
//   const pathname = usePathname()

//   return (
//     <nav className="grid items-start gap-2 px-2 py-4">
//       {items.map((item) => (
//         <Link
//           key={item.href}
//           href={item.href}
//           className={cn(
//             "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
//             pathname === item.href ? "bg-accent" : "transparent",
//           )}
//         >
//           <item.icon className="mr-2 h-4 w-4" />
//           <span>{item.title}</span>
//         </Link>
//       ))}
//     </nav>
//   )
// }


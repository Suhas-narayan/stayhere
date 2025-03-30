// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Building, DollarSign, ArrowUpRight, CalendarDays, TrendingUp } from "lucide-react"
// import { RecentBookings } from "@/components/dashboard/recent-bookings"
// import { PropertyOverview } from "@/components/dashboard/property-overview"

// export default function DashboardPage() {
//   return (
//     <div className="flex-1 space-y-8 p-0 md:p-8">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
//         <div className="flex items-center space-x-2">
//           <Button>
//             <Building className="mr-2 h-4 w-4" />
//             Add New Property
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="bookings">Bookings</TabsTrigger>
//           <TabsTrigger value="properties">Properties</TabsTrigger>
//           <TabsTrigger value="analytics">Analytics</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
//                 <DollarSign className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">$24,563.82</div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   <span className="text-emerald-500 font-medium inline-flex items-center">
//                     <ArrowUpRight className="h-3 w-3 mr-1" />
//                     +20.1%
//                   </span>{" "}
//                   from last month
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Bookings</CardTitle>
//                 <CalendarDays className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">38</div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   <span className="text-emerald-500 font-medium inline-flex items-center">
//                     <ArrowUpRight className="h-3 w-3 mr-1" />
//                     +12.5%
//                   </span>{" "}
//                   from last month
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
//                 <Building className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">8</div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   <span className="text-emerald-500 font-medium inline-flex items-center">
//                     <ArrowUpRight className="h-3 w-3 mr-1" />
//                     +2
//                   </span>{" "}
//                   new this month
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
//                 <TrendingUp className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">78.3%</div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   <span className="text-emerald-500 font-medium inline-flex items-center">
//                     <ArrowUpRight className="h-3 w-3 mr-1" />
//                     +5.2%
//                   </span>{" "}
//                   from last month
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//             <Card className="lg:col-span-4">
//               <CardHeader>
//                 <CardTitle>Revenue Overview</CardTitle>
//               </CardHeader>
//               <CardContent className="pl-2">
//                 <div className="h-[240px] bg-muted/20 rounded-md flex items-center justify-center">
//                   <p className="text-muted-foreground">Revenue chart would appear here</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="lg:col-span-3">
//               <CardHeader>
//                 <CardTitle>Recent Bookings</CardTitle>
//                 <CardDescription>You have 12 bookings this month</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <RecentBookings />
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid gap-4 grid-cols-1">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Property Overview</CardTitle>
//                 <CardDescription>Performance metrics for your listed properties</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <PropertyOverview />
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


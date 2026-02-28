import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItemsTable } from "@/components/admin/menu/menu-items-table";
import { AddMenuItemForm } from "@/components/admin/menu/add-menu-item-form";

export default function MenuManagementPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Menu Management
        </h1>
        <p className="text-muted-foreground text-lg">
          Add, edit, and manage your cafe's menu items and categories
        </p>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 h-auto p-1 bg-gray-100 rounded-lg">
          <TabsTrigger
            value="items"
            className="rounded-md py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Menu Items
          </TabsTrigger>

          <TabsTrigger
            value="add"
            className="rounded-md py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Add New Item
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="items">
            <MenuItemsTable />
          </TabsContent>

          <TabsContent value="add">
            <AddMenuItemForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

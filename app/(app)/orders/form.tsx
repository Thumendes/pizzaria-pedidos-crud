"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "@radix-ui/react-icons";
import { Trash, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface OrdersFormProps {}

const OrdersFormValues = z.object({
  customerId: z.string(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number(),
    })
  ),
});

type OrdersFormValues = z.infer<typeof OrdersFormValues>;

export function OrdersForm({}: OrdersFormProps) {
  const [open, setOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const form = useForm<OrdersFormValues>({ resolver: zodResolver(OrdersFormValues) });
  const formItems = useFieldArray({ control: form.control, name: "items" });

  const utils = trpc.useUtils();

  const menuItemsQuery = trpc.menu.getItems.useQuery({ take: 100 });
  const customersQuery = trpc.customers.getAll.useQuery({ take: 100 });

  const createOrderMutation = trpc.orders.create.useMutation();

  async function onSubmit(values: OrdersFormValues) {
    toast.promise(
      async () => {
        await createOrderMutation.mutateAsync(values);
        await utils.orders.getAll.invalidate();

        setOpen(false);
      },
      {
        loading: "Salvando item...",
        success: "Item salvo com sucesso",
        error: (error) => `Erro ao salvar item: ${error.message}`,
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset();
          setSearchParams((params) => params.delete("editing"));
        }

        setOpen(state);
      }}
    >
      <DialogTrigger asChild>
        <Button>Adicionar</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo pedido</DialogTitle>
          <DialogDescription>Preencha os campos para adicionar um item</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customersQuery.data?.data.map((customer) => (
                        <SelectItem value={customer.id} key={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p>Items</p>
                </div>

                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => formItems.append({ menuItemId: "", quantity: 1 })}
                  >
                    Adicionar item
                  </Button>
                </div>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-auto">
                {formItems.fields.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-muted-foreground text-sm">Item {index + 1}</p>
                      <div>
                        <X className="cursor-pointer text-destructive size-4" onClick={() => formItems.remove(index)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-10 gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.menuItemId`}
                        render={({ field }) => (
                          <FormItem className="col-span-8">
                            <FormLabel>Item</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Item" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {menuItemsQuery.data?.data.map((menuItem) => (
                                  <SelectItem value={menuItem.id} key={menuItem.id}>
                                    {menuItem.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Quantidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Quantidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Criar pedido</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

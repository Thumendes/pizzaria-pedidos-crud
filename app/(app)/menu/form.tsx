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
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { trpc } from "@/lib/trpc/client";
import { RouterOutput } from "@/server/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { P, match } from "ts-pattern";
import { z } from "zod";

type Editing = RouterOutput["menu"]["getOneItem"];

interface MenuItemsFormProps {
  editing?: Editing;
}

const MenuItemsFormValues = z.object({
  name: z.string(),
  description: z.string(),
  categoryId: z.string(),
  price: z.string().transform(Number),
});

type MenuItemsFormValues = z.infer<typeof MenuItemsFormValues>;

export function MenuItemsForm({ editing }: MenuItemsFormProps) {
  const [open, setOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const form = useForm<MenuItemsFormValues>({ resolver: zodResolver(MenuItemsFormValues) });

  useEffect(() => {
    if (editing) {
      form.reset({
        name: editing.name,
        description: editing.description,
        price: editing.price,
        categoryId: editing.categoryId,
      });

      setOpen(true);
    }
  }, [editing]);

  const utils = trpc.useUtils();

  const categoriesQuery = trpc.menu.categories.useQuery();
  const createMenuItemMutation = trpc.menu.createItem.useMutation();
  const updateMenuItemMutation = trpc.menu.updateItem.useMutation();

  async function onSubmit(values: MenuItemsFormValues) {
    const promise = match(editing)
      .with({ id: P.string }, ({ id }) => updateMenuItemMutation.mutateAsync({ ...values, id }))
      .otherwise(() => createMenuItemMutation.mutateAsync(values));

    toast.promise(
      async () => {
        await promise;
        await utils.menu.getItems.invalidate();

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
          <DialogTitle>{editing ? `Editar item: ${editing.name}` : `Adicionar item`}</DialogTitle>
          <DialogDescription>Preencha os campos para adicionar um item</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Preço" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesQuery.data?.map((category) => (
                        <SelectItem value={category.id} key={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Salvar item no menu</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

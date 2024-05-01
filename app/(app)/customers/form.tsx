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
import { useSearchParams } from "@/lib/hooks/useSearchParams";
import { trpc } from "@/lib/trpc/client";
import { RouterOutput } from "@/server/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { P, match } from "ts-pattern";
import { z } from "zod";

type Editing = RouterOutput["customers"]["getOne"];

interface CustomersFormProps {
  editing?: Editing;
}

const CustomersFormValues = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
});

type CustomersFormValues = z.infer<typeof CustomersFormValues>;

export function CustomersForm({ editing }: CustomersFormProps) {
  const [open, setOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const form = useForm<CustomersFormValues>({ resolver: zodResolver(CustomersFormValues) });

  useEffect(() => {
    if (editing) {
      form.reset({
        name: editing.name,
        phone: editing.phone,
        email: editing.email ?? "",
      });

      setOpen(true);
    }
  }, [editing]);

  const utils = trpc.useUtils();

  const createCustomerMutation = trpc.customers.create.useMutation();
  const updateCustomerMutation = trpc.customers.update.useMutation();

  async function onSubmit(values: CustomersFormValues) {
    const promise = match(editing)
      .with({ id: P.string }, ({ id }) => updateCustomerMutation.mutateAsync({ ...values, id }))
      .otherwise(() => createCustomerMutation.mutateAsync(values));

    toast.promise(
      async () => {
        await promise;
        await utils.customers.getAll.invalidate();

        setOpen(false);
      },
      {
        loading: "Salvando cliente...",
        success: "Cliente salvo com sucesso",
        error: (error) => `Erro ao salvar cliente: ${error.message}`,
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
          <DialogTitle>{editing ? `Editar client: ${editing.name}` : `Adicionar cliente`}</DialogTitle>
          <DialogDescription>Preencha os campos para adicionar um cliente</DialogDescription>
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Telefone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="E-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Salvar cliente</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

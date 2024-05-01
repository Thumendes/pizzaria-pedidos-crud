"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useCallback } from "react";
import { DefaultValues, UseFormReturn, useForm } from "react-hook-form";
import { match } from "ts-pattern";
import { z } from "zod";
import { create } from "zustand";
import { Alert } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface AlertDialogConfirmProps {
  description?: string;
  cancelText?: string;
  actionText?: string;
}

interface AlertDialogActionProps<T = unknown> {
  label: string;
  value: T;
}

interface AlertDialogActionsProps<
  Actions extends Readonly<AlertDialogActionProps[]> = Readonly<AlertDialogActionProps[]>
> {
  description?: string;
  actions: Actions;
}

interface AlertDialogFormProps<Schema extends z.ZodTypeAny = z.ZodTypeAny> {
  description?: ReactNode;
  schema: Schema;
  defaultValues?: DefaultValues<z.TypeOf<Schema>>;
  submitText?: string;
  form(form: UseFormReturn<z.TypeOf<Schema>>): JSX.Element;
}

type AlertDialogProps =
  | { type: "confirm"; props: AlertDialogConfirmProps }
  | { type: "actions"; props: AlertDialogActionsProps }
  | { type: "form"; props: AlertDialogFormProps };

interface AlertDialogStore {
  promise: Function | null;
  title: string | null;
  props: AlertDialogProps;
  clear(): void;
}

const alertDialogStore = create<AlertDialogStore>((set, get) => ({
  promise: null,
  title: null,
  props: {} as AlertDialogProps,

  clear() {
    set({
      promise: null,
      title: null,
      props: {} as AlertDialogProps,
    });
  },
}));

export const alert = {
  confirm(title: string, props?: AlertDialogConfirmProps) {
    return new Promise<boolean>((resolve) => {
      alertDialogStore.setState({
        title,
        promise: resolve,
        props: {
          type: "confirm",
          props: { ...props },
        },
      });
    });
  },

  actions<Actions extends Readonly<AlertDialogActionProps[]>>(title: string, props: AlertDialogActionsProps<Actions>) {
    return new Promise<Actions[number]["value"] | false>((resolve) => {
      alertDialogStore.setState({
        title,
        promise: resolve,
        props: { type: "actions", props },
      });
    });
  },

  form<Schema extends z.ZodTypeAny>(title: string, props: AlertDialogFormProps<Schema>) {
    return new Promise<z.TypeOf<Schema> | false>((resolve) => {
      alertDialogStore.setState({
        title,
        promise: resolve,
        props: { type: "form", props: props as unknown as AlertDialogFormProps },
      });
    });
  },
};

export function AlertDialogComponent() {
  const { promise, title, props, clear } = alertDialogStore();

  const handleAction = useCallback(
    (value?: unknown) => {
      clear();
      promise?.(value || true);
    },
    [promise, clear]
  );

  const handleCancel = useCallback(() => {
    clear();
    promise?.(false);
  }, [promise, clear]);

  return (
    <AlertDialog open={!!promise && !!title && !!props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {props.props && <AlertDialogDescription>{props.props.description}</AlertDialogDescription>}
        </AlertDialogHeader>

        {props.type &&
          match(props)
            .with({ type: "confirm" }, ({ props }) => (
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => handleCancel()}>{props.cancelText || "Cancelar"}</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction()}>{props.actionText || "Continuar"}</AlertDialogAction>
              </AlertDialogFooter>
            ))
            .with({ type: "actions" }, ({ props }) => (
              <AlertDialogFooter>
                {props.actions.map((action, index) => (
                  <AlertDialogAction key={index} onClick={() => handleAction(action.value)}>
                    {action.label}
                  </AlertDialogAction>
                ))}
              </AlertDialogFooter>
            ))
            .with({ type: "form" }, ({ props }) => {
              function WithForm() {
                const form = useForm({ resolver: zodResolver(props.schema), defaultValues: props.defaultValues });

                const handleSubmit = form.handleSubmit((data) => {
                  handleAction(data);
                });

                return (
                  <form onSubmit={handleSubmit}>
                    {form.formState.errors?.root && <Alert>{form.formState.errors?.root.message}</Alert>}

                    <div className="flex flex-col space-y-2 mb-3">{props.form(form)}</div>

                    <AlertDialogFooter>
                      <AlertDialogCancel type="button" onClick={() => handleCancel()}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction type="submit">{props.submitText ?? `Enviar`}</AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                );
              }

              return <WithForm />;
            })
            .exhaustive()}
      </AlertDialogContent>
    </AlertDialog>
  );
}

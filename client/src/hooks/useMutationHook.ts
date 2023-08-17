import { useMutation } from "@tanstack/react-query"

export const useMutationHooks = (fnCallback: (data: { email: string, password: string }) => Promise<any>)  => {
    const mutation = useMutation({
        mutationFn: fnCallback
    })
    return mutation
}
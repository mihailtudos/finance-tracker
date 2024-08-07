export const useAppToast = () => {
    const toast = useToast();

    return {
        toastSuccess: ({title, description = null}) => {
            toast.add({
                title: title,
                icon: 'i-heroicons-check-circle',
                color: 'green',
                description: description,
            });
        },
        toastError: ({title, description = null}) => {
            toast.add({
                title: title,
                icon: 'i-heroicons-exclamation-circle',
                color: 'red',
                description: description,
            });
        }
    }
}
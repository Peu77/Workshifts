import {useDeleteUser, User} from "@/routes/admin/usersApi.ts";
import {TableCell, TableRow} from "@/components/ui/table.tsx";
import { TrashIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {ColorRing} from "react-loader-spinner";

export const UserCell = (user: User) => {
    const deleteUserMutation = useDeleteUser()

    function removeUser() {
        if (deleteUserMutation.isPending) return
        deleteUserMutation.mutateAsync(user.id)
    }

    return (
        <TableRow>
            <TableCell className={user.role === "admin" ? "text-red-400" : ""}>{user.name}</TableCell>
            <TableCell className={user.role === "admin" ? "text-red-400" : ""}>{user.email}</TableCell>
            <TableCell>
                <div className="w-6 h-6 rounded-full" style={{backgroundColor: user.color}}/>
            </TableCell>
            <TableCell>
                <Button onClick={removeUser} size="icon" variant="ghost">
                    {deleteUserMutation.isPending ? <ColorRing
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                    /> : <TrashIcon/>}
                </Button>
            </TableCell>
        </TableRow>
    )
}
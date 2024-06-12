import {useGetUsers} from "@/routes/admin/usersApi.ts";
import {Button} from "@/components/ui/button.tsx";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {DialogContext} from "@/provider/DialogProvider.tsx";
import {useContext} from "react";
import {UserCell} from "@/routes/admin/user.tsx";
import {CreateUser} from "@/routes/admin/dialog/createUser.tsx";

export const Users = () => {
    const users = useGetUsers()
    const {setDialog} = useContext(DialogContext)

    return (
        <div>
            <Button className="" onClick={() => setDialog(<CreateUser/>)}>Create user</Button>
            {users.isLoading && <p>Loading...</p>}
            {users.isError && <p>Error</p>}
            {users.data && (
                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>name</TableHead>
                            <TableHead>email</TableHead>
                            <TableHead>actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.map((user) => (
                            <UserCell key={user.id} {...user}/>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}
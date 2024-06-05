
import {createContext, useEffect, useState} from "react";
import {Dialog} from "@/components/ui/dialog";

type DialogContextType = {
    setDialog: (dialog: JSX.Element | null) => void
}

type DialogProviderProps = {
    children: JSX.Element
}
export const DialogContext = createContext<DialogContextType>({
    setDialog: () => {
    }
})
export const ModalProvider = (props: DialogProviderProps) => {
    const [dialog, setDialog] = useState<JSX.Element | null>(null)

    useEffect(() => {
        const body = document.querySelector("body")

        // if modal is null remove pointer-events: none from style
        if (dialog === null) {
            body?.style.removeProperty("pointer-events")
        }
    }, [dialog]);

    return (
        <DialogContext.Provider value={{ setDialog}}>
            <Dialog children={dialog} open={true} onOpenChange={() => setDialog(null)}/>
            {props.children}
        </DialogContext.Provider>
    )
}

export default ModalProvider;
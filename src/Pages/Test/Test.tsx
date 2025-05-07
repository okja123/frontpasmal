import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import FormTest from "../../Components/Form/FormTest/FormTest";
import TableTest from "../../Components/Table/TableTest/TableTest";
import { CameraManagerApiClient } from "../../Utils/CameraManagerClientApi";

export default function test(){
    /*
    const [formvisible, setformVisible] = useState(false);
    const [itemSelected, setItemSelected] = useState<any|null>(null);
    function formTemplate(){
        let hide = ()=>{
            setformVisible(false)
        }
        return(
            <FormTest hide={hide} item={itemSelected} setitem={setItemSelected}/>
        )
    }
    
   function test(item:any){
    console.log(item)
   }
    */
   useEffect(()=>{
        CameraManagerApiClient.site_nbrCamera("ORY")
        .then((res)=>{
            console.log(res)
        })
   },[])
    return(
        <div>
            {
                /*
                <Button onClick={()=>{
                    setformVisible(true);
                    setItemSelected(null)
                }}></Button>
                <Dialog
                    visible={formvisible}
                    modal
                    onHide={() => {if (!formvisible) return; setformVisible(false); }}
                    content={formTemplate}/>
                */
            }
            {
                /**
                 * <TableTest items={[{ name: 'a' }, { name: 'b' }, { name: 'c' }]} onEdit={test} onSelect={test} onDelete={test} selectionMode="multiple"></TableTest>
                 */
            }
            a
        </div>
    )
}
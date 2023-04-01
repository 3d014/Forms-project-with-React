import Search from "./Search"
import { useState } from "react"
import FormularRow from "./FormularRow"
import { getFormularIds, getTemplate,updateFormular,insertFormular, getFormularData } from "../Services/indexedDB"
import { questionary } from "./Administration"
import './Formular.css'
import { v4 as uuidv4 } from 'uuid';


interface formularProps{
    toggleSearch:string
}


export interface data{
    id:string;
    value:string;
}
export interface formular{
    id:string;
    value:data[]
}

let initialData:formular={
    id:uuidv4(),
    value:[{id:'',value:''}]
  }
export default function Formular(props:formularProps){
    
    const [searchBarValue,setSearchBarValue]=useState<string>('')
    const [formularRows,setFormularRows]=useState<questionary[]>([])
    const [formular,setFormular]=useState<formular>(initialData)
    const [showValidation,setShowValidation]=useState<boolean>(false)
    
    
    const newFormular=()=>{
      let initialData:formular={
        id:uuidv4(),
        value:[{id:'',value:''}]
      }
      setShowValidation(false)
       if(searchBarValue){
         getTemplate(searchBarValue).then(
            (value)=>{
                setFormularRows(value.data)
                initialData.value=[]
                value.data.forEach(item=>{
                    initialData.value.push({id:item.id,value:""})
                })
         setFormular(initialData)

            },
            (error)=>{
                alert('Template not found in database')
            }
            
         )
         
       } else {
        alert('enter formular name')

       }

    }

    const validate=():boolean=>{
        let isValid=true;

        formularRows.map(question=>{
            if(question.validationType==='Mandatory'){
               let value=formular.value.find(answer=>answer.id===question.id)?.value
               if(value===''){
                isValid=false
               }
            }
        })
        return isValid
    }
    const handleFormSave=(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault()  
        setShowValidation(true)
        let isValid=validate()
        if(isValid){
        getFormularIds(searchBarValue).then(formularIds=>{
            if(formular?.id&&formularIds.includes(formular.id)){

                updateFormular(searchBarValue,formular.id,formular)
                newFormular()
            } else if(formular?.id && !formularIds.includes(formular.id)){
                insertFormular(searchBarValue,formular)
                newFormular()
            }
        })
        } else {
            alert('Fill mandatory fields')
        }

    }

    const handleSetData=(dataId:string,dataValue:string)=>{
        
         if(formular?.value){
        let updatedFormularData:data[]=formular.value.map(data=>{
            if(data.id===dataId){
                let newData:data={id:dataId,value:dataValue}
                return newData
            } else return data
        })
        let updatedFormular:formular={
            id:formular.id,
            value:updatedFormularData
        }
        setFormular(updatedFormular)
    }
    }
    
    const loadFormularData=async(id:number)=>{
        if(searchBarValue){
            try{
                let newFormularRows=(await getTemplate(searchBarValue)).data
                let newData=await getFormularData(searchBarValue,id)
                setFormularRows(newFormularRows)
                setFormular(newData)

            }
            catch{
                console.log('wtf')
            }
        }
    }
    
    
    return( 
    <div>
        <Search toggleSearch={props.toggleSearch} 
        setSearchValue={setSearchBarValue} 
        addNewDataToFormular={newFormular}
        loadFormular={loadFormularData}/>
        
        <div className="formular">
        {formularRows.map(question=>(
        
        <FormularRow key={question.id} 
        data={question} 
        formularData={formular.value} 
        setData={handleSetData}
        validation={showValidation}/>
        )
        )}
        <button className='submitButton' onClick={(e)=>{handleFormSave(e)}}>Save Data</button>
        </div>
    </div>
   )
}
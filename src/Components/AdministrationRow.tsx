import './AdministrationRow.css'
import { questionary } from "./Administration"
import React, {useState} from 'react'
import { v4 as uuidv4 } from 'uuid';


interface formRowProps{
    question:questionary,
    onEdit:(editedQuestion:questionary)=>void
    onAdd:(e:React.MouseEvent<HTMLButtonElement>)=>void
    onDelete:(e:React.MouseEvent<HTMLButtonElement>,questionId:string)=>void
    isLast:boolean,
    count:number,
    hasError:boolean;
    showValidation:boolean;
}

export default function AdministrationRow(props:formRowProps){

    
    
    
    const [isRadio,setIsRadio]=useState<boolean>(props.question.inputType==="Radio buttons")

    const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        
        props.onEdit({...props.question,inputName:e.target.value})
    }

    const handleInputTypeChange=(e:React.ChangeEvent<HTMLSelectElement>)=>{
        
        
        if(e.target.value==="Radio buttons"){
            setIsRadio(true)
            props.onEdit({...props.question,inputType:e.target.value,radioButtons:[{id:uuidv4(),value:''},{id:uuidv4(),value:''}]})
        }
        else{
            setIsRadio(false)
            props.onEdit({...props.question,inputType:e.target.value})}
    }

    
    
    

    

    const handleValidationTypeChange=(e:React.ChangeEvent<HTMLSelectElement>)=>{
        
        props.onEdit({...props.question,validationType:e.target.value})

    }

    const handleRadioValueChange=(e:React.ChangeEvent<HTMLInputElement>,element:{id:string,value:string})=>{
            
        
            let updatedRadioButtons=props.question.radioButtons?.map((question)=>question.id===element.id?{id:element.id,value:e.target.value}:question)
            props.onEdit({...props.question,radioButtons:updatedRadioButtons})
        
    }

    const handleAddRadio=(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault()
        if(props.question.radioButtons){
        let newRadioButtons:{id:string,value:string}[]=[...props.question.radioButtons,{id:uuidv4(),value:''}]
        props.onEdit({...props.question,radioButtons:newRadioButtons})
    }
    }
    const handleDeleteRadio=(e:React.MouseEvent<HTMLButtonElement>,id:string)=>{
        e.preventDefault();
        let updatedRadioButtons:{id:string,value:string}[]
        if(props.question.radioButtons && props.question.radioButtons.length>2){

        updatedRadioButtons=props.question.radioButtons.filter((radio)=>{return radio.id!==id})
        props.onEdit({...props.question,radioButtons:updatedRadioButtons})
        }
    }

    
    return <div className='mainFormRowDiv'>
        <div className='mainRow'>
    <label>Element {props.count}</label>
    <input 
        value={props.question.inputName} 
        onChange={handleInputChange} 
        className={
            (props.showValidation && props.question.inputName==="")?"invalidInputLabel":"validInputLabel"
            }
        >
        </input>
    <select  value={props.question.inputType} onChange={handleInputTypeChange}>
        <option value="Textbox">Textbox</option>
        <option value="Checkbox">Checkbox</option>
        <option value="Radio buttons">Radio buttons</option>
    </select>
    <select className='validationSelect' value={props.question.validationType} onChange={handleValidationTypeChange}>
        <option value="None">None</option>
        <option value="Mandatory">Mandatory</option>
        <option value="Numeric">Numeric</option>
    </select>
            <div className='buttons'>
    {props.isLast && <button onClick={props.onAdd} className='formRowButton'>+</button>}
    <button onClick={(e)=>{props.onDelete(e,props.question.id)}} className="formRowButton">-</button>
            </div>
    </div>
    <div className='additionalRow'>
    {isRadio && (
    <div>
        {props.question.radioButtons?.map(
            (element)=>
            <div key={element.id}>
                <input className={(props.showValidation && element.value==="")?"invalidRadioLabel":"validRadioLabel"} 
                key={element.id} 
                value={element.value} 
                onChange={(e)=>{handleRadioValueChange(e,element)}}>
                    
                </input>
        <button className="radioButton" onClick={(e)=>{handleDeleteRadio(e,element.id)}}>-</button>
        {props.question.radioButtons && props.question.radioButtons.length>=1 && 
        props.question.radioButtons[props.question.radioButtons.length-1].id===element.id && 
        <button className="radioButton" onClick={handleAddRadio}>+</button> }
        </div>)}
    </div>)}
    </div>
    </div>
}
import { questionary } from "./Administration"
import './FormularRow.css'

import { data } from "./Formular"
interface FormularRowProps{
    data:questionary
    setData:(id:string,value:string)=>void
    formularData:data[]
    validation:boolean
} 

export default function FormularRow(props:FormularRowProps){
       
    

       return (
        <div className="container">
            <div className="labelDiv">
            <label>{props.data.inputName}{props.data.validationType==="Mandatory"&&'*'}</label>
            </div>
            <div className="value">
            {props.data.inputType==='Textbox' && (
                <>
                {
                <input type={props.data.validationType==='Numeric'?'number':'text'} 
                className=
                {props.data.validationType==='Mandatory' && props.validation &&
                props.formularData.find(item=>item.id===props.data.id)?.value===""?'invalidInput':'validInput'}
                value={props.formularData.find(item=>item.id===props.data.id)?.value}
                onChange={(e)=>{props.setData(props.data.id,e.target.value)}}></input>}

                </> 
            )
                
            }
            {props.data.inputType==='Checkbox' && 
            <input type={"checkbox"} checked={props.formularData.find(item=>item.id===props.data.id)?.value==="true"}
            onChange={(e)=>{props.setData(props.data.id,e.target.checked.toString())}}></input>}
            {props.data.inputType==='Radio buttons' && 
            (
                props.data.radioButtons?.map((radioButton,index)=>{
                    return (
                    <div key={index} className="radioButtonsDiv">
                        <label>{radioButton.value}</label>
                        <div>
                        <input type={"radio"} name={props.data.inputName} value={radioButton.value} 
                        checked={props.formularData.find(item=>item.id===props.data.id)?.value===radioButton.id} 
                        onChange={()=>{props.setData(props.data.id,radioButton.id)}}></input>
                        </div>
                    </div>     
                    )
                })
            )
            } </div>
        </div>
        
    )
}
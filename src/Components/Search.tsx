import { useState } from 'react'
import './Search.css'


interface SearchProps{
    
    onSearch?:(e:React.MouseEvent<HTMLButtonElement>)=>void
    setSearchValue:(searchValue:string)=> void
    toggleSearch:string
    addNewDataToFormular?:()=>void
    loadFormular?:(id:number)=>void

}

export default function Search(props:SearchProps){
    const [id,setId]=useState<number>(0)
    
    if(props.toggleSearch==='Administration'){
        return <div className='search'>
            <label style={{margin:'5px 10px 5px 10px'}}>Formular name</label>
            <input placeholder="some formular" style={{margin:'5px 30px 5px 0px'}}  onChange={(e)=>{props.setSearchValue(e.target.value)}}></input>
            <button style={{marginLeft:'10px'}} onClick={props.onSearch}>Search</button>
        </div>
    } else {
        return <div className='search'>
            <label style={{margin:'5px 10px 5px 10px'}}>Formular name</label>
            <input placeholder="some formular" style={{margin:'5px 30px 5px 0px'}}
              onChange={(e)=>{props.setSearchValue(e.target.value)}}>
            </input>
            <label>Data id </label>
            <input value={id} type={'number'} onChange={(e)=>{setId(parseInt(e.target.value))}}></input>
            <button onClick={(e)=>{
                e.preventDefault()
                if(props.loadFormular){
                    props.loadFormular(id)
                }

            }}>Load data</button>
            <button onClick={(e)=>{
                e.preventDefault()
                if(props.addNewDataToFormular){
                    props.addNewDataToFormular()
                }
            }}>New data</button>
        </div>
    }
}
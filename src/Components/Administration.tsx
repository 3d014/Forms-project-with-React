import './Administration.css'
import Search from './Search';
import AdministrationRow from './AdministrationRow';
import { v4 as uuidv4 } from 'uuid';
import React, {useEffect, useState} from 'react';
import { insertTemplate,getTemplate,getTemplateNames,updateTemplate,makeFormularStore } from '../Services/indexedDB';

export interface questionary{
    id:string;
    inputName:string;
    inputType:string;
    validationType:string;
    radioButtons?:{
        id:string,
        value:string,
    }[]
}
export interface templateData{
    data:questionary[];
    formName:string;
}

let initalQuestion:questionary={
    id:uuidv4(),
    inputName:"",
    inputType:"Textbox",
    validationType:"None",
}

interface AdministrationProps {
    toggleSearch: string
}

export default function Administration( props : AdministrationProps){

   

    const [questions,setQuestions]=useState<questionary[]>([initalQuestion])
    
    const [searchBarValue,setSearchBarValue]=useState<string>('')
    const [validationErrors,setValidationErrors]=useState<string[]>([])
    const [showValidation,setShowValidation]=useState<boolean>(false)
    let count=1

    function editQuestion(editedQuestion:questionary){
        
        let updatedQuestions:questionary[]=questions
        .map(question=>question.id===editedQuestion.id?editedQuestion:question)
        setQuestions(updatedQuestions)
        
    }

    const addQuestion=(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault()
        let newQuestion:questionary={
            id:uuidv4(),
            inputName:"",
            inputType:"Textbox",
            validationType:"None",  
        }
        let updatedQuestions:questionary[]=[...questions,newQuestion]
        setQuestions(updatedQuestions)
    }
    const deleteQuestion=(e:React.MouseEvent<HTMLButtonElement>,deletedQuestionId:string)=>{
        e.preventDefault();
        if(questions.length>1){
        let updatedQuestions=questions.filter((question)=>{return question.id!==deletedQuestionId})
        setQuestions(updatedQuestions)
        }
    }
    
    
    const handleTemplateSubmit=(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault()
        setShowValidation(true)
       
        getTemplateNames().then(templates=>{
            
       
        if(validationErrors.length===0){
            if(searchBarValue!=='' && !templates.includes(searchBarValue)){
            let template:templateData={
                data:questions,
                formName:searchBarValue,
            }
            insertTemplate(template)
            makeFormularStore(template.formName)
            setShowValidation(false)
            } else if(searchBarValue!=="" && templates.includes(searchBarValue)){
                let template:templateData={
                    data:questions,
                    formName:searchBarValue,
                }
                updateTemplate(template)
                setShowValidation(false)
            }
            else {
                alert('You must add template name')
            }

        } else {
            alert('Cannot insert template with errors')
        }
         })
       
        
        
    }
    


    useEffect(()=>{checkForValidationErrors()},[questions])

    const checkForValidationErrors=()=>{
        
        const newValidationErrors:string[] = [];

        questions.forEach((question) => {
          Object.values(question).forEach((item) => {
            if (Array.isArray(item)) {
                
              item.forEach((inputItem) => {
                if (inputItem.value === null || inputItem.value === '') {
                  if (!newValidationErrors.includes(question.id)) {
                    newValidationErrors.push(question.id);
                  }
                }
              });
            } else {
              if (item === null || item === '') {
                if (!newValidationErrors.includes(question.id)) {
                  newValidationErrors.push(question.id);
                }
              }
            }
          });
          setValidationErrors(newValidationErrors)
        });
    }
    const searchTemplate=(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        let template=null
        if(searchBarValue){
            getTemplate(searchBarValue).then((value)=>{
                template=value.data
                setQuestions(template)
            },
            (error)=>{
                setQuestions([initalQuestion])
                setValidationErrors([])
                console.log('You can make new template and add it to database')
            })
        } else {
            setQuestions([initalQuestion])
            setValidationErrors([])
        }
       
    }

    
    return <>   
    <Search  setSearchValue={setSearchBarValue} onSearch={searchTemplate} toggleSearch={props.toggleSearch}/>
    <div className='formTemplate'>
    {questions.map(question=>(
    <div className='formRow' key={question.id}>
        <AdministrationRow key={question.id}
        question={question} 
        count={count++} 
        onEdit={editQuestion} 
        onAdd={addQuestion} 
        onDelete={deleteQuestion} 
        isLast={question.id===questions[questions.length-1].id} 
        hasError={validationErrors.includes(question.id)} 
        showValidation={showValidation}/>
    
    </div>
    )
    )}

    <button className='submitButton' onClick={handleTemplateSubmit}>Submit</button>
    </div> 
    </>
}
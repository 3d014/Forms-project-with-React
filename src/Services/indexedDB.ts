
import { templateData } from "../Components/Administration";
import { formular } from "../Components/Formular";
let db: IDBDatabase | null=null;
export const createDataBase=()=>{





const openDbRequest=window.indexedDB.open("FormDatabase")

openDbRequest.onerror=(event)=>{
    console.error('error generated'+ event)
}

openDbRequest.onsuccess=(event)=>{
    const target=event.target as IDBOpenDBRequest;
    db=target.result;
}

openDbRequest.onupgradeneeded=(event)=>{
    const target=event.target as IDBOpenDBRequest;
    db=target.result;
    const objectStore=db.createObjectStore("Templates",{keyPath:"formName"})
    objectStore.transaction.oncomplete=(event)=>{
        console.log('jebote')
    }
}

}
export const insertTemplate=(template:templateData)=>{
    if(db){
        const transaction=db.transaction('Templates','readwrite')
        const objectStore=transaction.objectStore('Templates')

        transaction.onerror=()=>{
            console.log('problem with transaction')
        }

        transaction.oncomplete=()=>{
            console.log('transaction good')
        }

        let request = objectStore.add(template)
        request.onerror=(event)=>{
            console.log('could not add', template)
        }
        request.onsuccess=(event)=>{
            console.log('sucessfully added form template')
        }
    }
}

export const getTemplate=async (templateName:string):Promise<templateData>=>{
    return new Promise((resolve,reject)=>{
        if(db){
            const transaction=db.transaction('Templates','readonly')
            const objectStore=transaction.objectStore('Templates')

            const request=objectStore.get(templateName)
            request.onerror=(error)=>{
                console.log(error)
                reject()
            }    
            request.onsuccess=async (event)=>{
                const template=await request.result
                if(template){
                resolve(template)
                } else {
                    console.log('template not found in database')
                    reject()
                }
            }




        }else{
            reject()
        }


    })

   
}
 export const getTemplateNames=():Promise< string[]>=>{
        return new Promise((resolve,reject)=>{
            if (db){
                const transaction=db.transaction('Templates','readonly')
                const objectStore=transaction.objectStore('Templates')
                const request=objectStore.getAllKeys()

                request.onerror=(error)=>{
                    console.log(error )
                    reject()
                }   
                
                request.onsuccess=(event)=>{
                    
                    let templateNames=request.result
                   
                    if(templateNames){ 
                    let stringTemplateNames:string[]=templateNames.map(key=>{return key.toString()})
                    resolve(stringTemplateNames)
                    } else {
                        console.log('template not found in database')
                        reject()
                    }
                }

            } else {
                reject()
            }
        })

    
    }

export const updateTemplate=(updatedTemplate:templateData)=>{
    if(db){
        const transaction=db.transaction('Templates','readwrite')
        const objectStore=transaction.objectStore('Templates')

        const request=objectStore.get(updatedTemplate.formName)
        request.onerror=(error)=>{
            console.log(error)
        }
        request.onsuccess=async(event)=>{
            
            let template=await request.result
            if(template){
                template.data=updatedTemplate
                
                const requestUpdate=objectStore.put(template.data)


                requestUpdate.onerror=(error)=>{
                    console.log(error)
                }
                requestUpdate.onsuccess=(event)=>{
                    console.log('successfuly updated')
                }
            }

        }
    }
}
export const makeFormularStore=(name:string)=>{
    if(db){
        let version=db.version
        version=version+1
        db.close()

        const openDbRequest=window.indexedDB.open("FormDatabase",version)
        openDbRequest.onupgradeneeded=(event)=>{
            db=openDbRequest.result
            const objectStore=db.createObjectStore(name,{keyPath:"id"})
            objectStore.transaction.oncomplete =(event)=>{
                console.log("store created")
            }
    
        }

        openDbRequest.onsuccess=(event)=>{
            db=openDbRequest.result
        }
    }
}


export const getFormularIds=(formularStoreName:string):Promise<string[]>=>{
    return new Promise((resolve,reject)=>{
        if(db){
            try{
                const transaction=db.transaction(formularStoreName,'readonly')
            const objectStore=transaction.objectStore(formularStoreName)
            const request=objectStore.getAllKeys()

            request.onerror=(error)=>{
                console.log('error while trying to get keys ---' + error)
                reject()
            }

            request.onsuccess=(event)=>{
                let formularIds=request.result

                if(formularIds){
                    let stringIds:string[]=formularIds.map(key=>{return key.toString()})
                    resolve(stringIds)
                } else {
                    console.log('formularStore not found in database')
                    alert('formularStore not found in database')
                    reject()
                }
            } } catch(error){
                alert('there is a problem with your request')
                console.log(error)
            }   
            
            }else {
                reject()
        }
    })
    
}

export const updateFormular=(formularStore:string,id:string,updatedFormular:formular)=>{
    if(db){
        const transaction=db.transaction(formularStore,'readwrite')
        const objectStore=transaction.objectStore(formularStore)

        const request=objectStore.get(id)
        request.onerror=(error)=>{
            console.log(error)
        }
        request.onsuccess=async(event)=>{
            let formular=await request.result
            if(formular){
                formular.data=updatedFormular
                const requestUpdate=objectStore.put(formular.data)
                requestUpdate.onerror=(error)=>{
                    console.log(error)
                }
                requestUpdate.onsuccess=(event)=>{
                    console.log('sucessfuly updated')
                }
            }
        }

    }
}

export const insertFormular=(formularStore:string,formular:formular)=>{

    if(db){
        const transaction=db.transaction(formularStore,'readwrite')
        const objectStore=transaction.objectStore(formularStore)

        transaction.onerror=()=>{
            console.log('problem with transaction')
        }
        transaction.oncomplete=()=>{
            console.log('transaction good')
        }

        let request=objectStore.add(formular)
        request.onerror=(event)=>{
            console.log('could not add', formular)
        }
        request.onsuccess=(event)=>{
            console.log('sucessfully added formular')
        }
    }

}

export const getFormularData=(formularStore:string,id:number):Promise<formular>=>{
    return new Promise((resolve,reject)=>{
        if(db){
            const transaction=db.transaction(formularStore,'readonly')
            const objectStore=transaction.objectStore(formularStore)

            const request=objectStore.getAll()
            request.onerror=(error)=>{
                console.log(error)
                reject()
            }
            request.onsuccess=async (event)=>{
                const formular=request.result
                let formularData=formular[id]

                if(formularData){
                    resolve(formularData)
                } else {
                    console.log('formular not found')
                    reject()
                }

            }
        }

    })
}
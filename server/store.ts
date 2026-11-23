import { pathToFileURL } from "bun";
import type { Task } from "./types";


export interface TaskStore{

    create(task:Task):void;
    get(id:string):Task|undefined;
    list():Task[];
    update(id:string,patch:Partial<Task>):Task|undefined
}


export class MemoryTaskStore implements TaskStore{

    private tasks=new Map<string,Task>();


    create(task:Task):void{
        this.tasks.set(task.id,task);
    }

    get(id:string):Task|undefined{
        return this.tasks.get(id);

    }

    list():Task[]{
        return [...this.tasks.values()]
    }

    update(id:string,patch:Partial<Task>):Task|undefined{
        const existing=this.tasks.get(id);
        if(!existing){
            return undefined;

        }
        const updated={...existing,...patch};
        this.tasks.set(id,updated);
        return updated;
    }

}
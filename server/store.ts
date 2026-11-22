import type { Task}  from "./models/types";

export interface TaskStore{

    create(task:Task):void;
    get(id:string):Task|undefined;
    list():Task[];
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

}
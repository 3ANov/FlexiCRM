export namespace models {
	
	export class ClientDocument {
	    ID: number;
	    ClientID: number;
	    TemplateID: number;
	    // Go type: time
	    CreatedAt: any;
	    Data: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new ClientDocument(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ClientID = source["ClientID"];
	        this.TemplateID = source["TemplateID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.Data = source["Data"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Note {
	    ID: number;
	    Content: string;
	    ClientID?: number;
	    ProjectID?: number;
	    // Go type: time
	    CreatedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new Note(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Content = source["Content"];
	        this.ClientID = source["ClientID"];
	        this.ProjectID = source["ProjectID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Employee {
	    ID: number;
	    Name: string;
	    Role: string;
	    Email: string;
	    Phone: string;
	    Active: boolean;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new Employee(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Role = source["Role"];
	        this.Email = source["Email"];
	        this.Phone = source["Phone"];
	        this.Active = source["Active"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Task {
	    ID: number;
	    Title: string;
	    Description: string;
	    AssignedTo: number;
	    Employee: Employee;
	    ProjectID: number;
	    Status: string;
	    // Go type: time
	    Deadline: any;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	        this.Description = source["Description"];
	        this.AssignedTo = source["AssignedTo"];
	        this.Employee = this.convertValues(source["Employee"], Employee);
	        this.ProjectID = source["ProjectID"];
	        this.Status = source["Status"];
	        this.Deadline = this.convertValues(source["Deadline"], null);
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Project {
	    ID: number;
	    ClientID: number;
	    Name: string;
	    Description: string;
	    Status: string;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    Tasks: Task[];
	
	    static createFrom(source: any = {}) {
	        return new Project(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.ClientID = source["ClientID"];
	        this.Name = source["Name"];
	        this.Description = source["Description"];
	        this.Status = source["Status"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.Tasks = this.convertValues(source["Tasks"], Task);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Client {
	    ID: number;
	    Name: string;
	    Phone: string;
	    Email: string;
	    Description: string;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    Projects: Project[];
	    Notes: Note[];
	    Documents: ClientDocument[];
	
	    static createFrom(source: any = {}) {
	        return new Client(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Phone = source["Phone"];
	        this.Email = source["Email"];
	        this.Description = source["Description"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.Projects = this.convertValues(source["Projects"], Project);
	        this.Notes = this.convertValues(source["Notes"], Note);
	        this.Documents = this.convertValues(source["Documents"], ClientDocument);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ClientDocumentSearch {
	    client_id?: number;
	    template_id?: number;
	
	    static createFrom(source: any = {}) {
	        return new ClientDocumentSearch(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.client_id = source["client_id"];
	        this.template_id = source["template_id"];
	    }
	}
	export class ClientSearch {
	    query?: string;
	
	    static createFrom(source: any = {}) {
	        return new ClientSearch(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.query = source["query"];
	    }
	}
	
	export class EmployeeDocument {
	    ID: number;
	    EmployeeID: number;
	    TemplateID: number;
	    // Go type: time
	    CreatedAt: any;
	    Data: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new EmployeeDocument(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.EmployeeID = source["EmployeeID"];
	        this.TemplateID = source["TemplateID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.Data = source["Data"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class EmployeeDocumentSearch {
	    employee_id?: number;
	    template_id?: number;
	
	    static createFrom(source: any = {}) {
	        return new EmployeeDocumentSearch(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.employee_id = source["employee_id"];
	        this.template_id = source["template_id"];
	    }
	}
	export class EmployeeSearch {
	    query?: string;
	    active?: boolean;
	
	    static createFrom(source: any = {}) {
	        return new EmployeeSearch(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.query = source["query"];
	        this.active = source["active"];
	    }
	}
	
	export class NoteSearch {
	    query?: string;
	    client_id?: number;
	    project_id?: number;
	
	    static createFrom(source: any = {}) {
	        return new NoteSearch(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.query = source["query"];
	        this.client_id = source["client_id"];
	        this.project_id = source["project_id"];
	    }
	}
	
	export class ProjectSearch {
	    query?: string;
	    client_id?: number;
	    status?: string;
	
	    static createFrom(source: any = {}) {
	        return new ProjectSearch(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.query = source["query"];
	        this.client_id = source["client_id"];
	        this.status = source["status"];
	    }
	}
	
	export class TaskSearch {
	    query?: string;
	    status?: string;
	    assigned_to?: number;
	    project_id?: number;
	    // Go type: time
	    deadline?: any;
	
	    static createFrom(source: any = {}) {
	        return new TaskSearch(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.query = source["query"];
	        this.status = source["status"];
	        this.assigned_to = source["assigned_to"];
	        this.project_id = source["project_id"];
	        this.deadline = this.convertValues(source["deadline"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Transaction {
	    ID: number;
	    Type: string;
	    Amount: number;
	    // Go type: time
	    Date: any;
	    Category: string;
	    Notes: string;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new Transaction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Type = source["Type"];
	        this.Amount = source["Amount"];
	        this.Date = this.convertValues(source["Date"], null);
	        this.Category = source["Category"];
	        this.Notes = source["Notes"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TransactionSearch {
	    query?: string;
	    type?: string;
	    category?: string;
	    // Go type: time
	    date_from?: any;
	    // Go type: time
	    date_to?: any;
	    min_amount?: number;
	    max_amount?: number;
	
	    static createFrom(source: any = {}) {
	        return new TransactionSearch(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.query = source["query"];
	        this.type = source["type"];
	        this.category = source["category"];
	        this.date_from = this.convertValues(source["date_from"], null);
	        this.date_to = this.convertValues(source["date_to"], null);
	        this.min_amount = source["min_amount"];
	        this.max_amount = source["max_amount"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}


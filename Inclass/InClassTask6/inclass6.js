class Student{
    constructor(name,course,id){
        this.name = name;
        this.course = course;
        this.id = id;
    }
    PrintStudentDetails(){
        console.log(
            `
            **********************************
            **********************************
                     Name: ${this.name}
                   Courses: ${this.course}
                       ID: ${this.id}
            **********************************
            **********************************
            `
        );
    }
}

const student = new Student('Sangbong','PROG1800',8692765);
student.PrintStudentDetails();
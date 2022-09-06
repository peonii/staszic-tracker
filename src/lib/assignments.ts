import { AssignmentType } from "@prisma/client"

const getAssignmentName = (assigmentType: AssignmentType) => {
    switch (assigmentType) {
        case AssignmentType.EXAM:
            return 'sprawdzian'
        case AssignmentType.ESSAY:
            return 'wypracowanie'
        case AssignmentType.HOMEWORK:
            return 'praca domowa'
        case AssignmentType.SHORT_TEST:
            return 'kartkowka'
        case AssignmentType.PRESENTATION:
            return 'prezentacja'
        case AssignmentType.ORAL:
            return 'odpowiedź ustna'
    }
}

const getAssignmentType = (assignmentName: string) => {
    switch (assignmentName) {
        case 'sprawdzian':
            return AssignmentType.EXAM
        case 'wypracowanie':
            return AssignmentType.ESSAY
        case 'praca domowa':
            return AssignmentType.HOMEWORK
        case 'kartkowka':
            return AssignmentType.SHORT_TEST
        case 'prezentacja':
            return AssignmentType.PRESENTATION
        case 'odpowiedź ustna':
            return AssignmentType.ORAL
        default:
            return AssignmentType.EXAM
    }
}

export { getAssignmentName, getAssignmentType }
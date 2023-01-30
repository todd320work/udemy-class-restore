export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data: 42,
    title: 'YARC yet another redux counter',
}

export default function counterPage(state = initialState, action: any){
    return state;
}
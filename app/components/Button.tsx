export function Button({ 
    onClick,
    value
}:{
    value: string,
    onClick?: ()=>void
}){
    return (
        <>
            <button onClick={onClick} className="w-20 h-10 bg-primary/80 hover:bg-primary rounded-md">
                {value}
            </button>
        </>
    )
}

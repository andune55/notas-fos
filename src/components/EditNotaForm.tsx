import { useState, useEffect, ChangeEvent, FormEvent, useMemo } from "react"
import { Nota } from "../types"
import { useNotaStore } from '../store';


const { editingId } = useNotaStore()

export default function EditNotaForm() {

  // const [expense, setExpense] = useState<DraftExpense>({
  //   amount: 0,
  //   expenseName: '',
  //   category: '',
  //   date: new Date()
  // })
  // const { presupuesto, expenses, editingId, addExpense, updateExpense } = useBudgetStore()

  // const [error, setError] = useState('')
  // //const [previousAmount, setPreviousAmount] = useState(0)

  // const totalExpenses = useMemo( () => expenses.reduce((total,expense) => expense.amount + total, 0 )
  //   , [expenses])  
  // const remainingBudget = presupuesto - totalExpenses



  // useEffect(() => {
  //   if(editingId){
  //     const editingExpense = expenses.filter( currentExpense => currentExpense.id === editingId)[0]
  //     setExpense(editingExpense)
  //     //setPreviousAmount(editingExpense.amount)
  //   }
  // },[editingId])

  // const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value } = e.target //extraemos name y value de cada campo de formulario
  //   const isAmountField = ['amount'].includes(name) //true si estamos escribiendo en amount y false si escribimos en gasto o seleccionamos categoría
  //   //console.log(isAmountField)
  //   setExpense({
  //     ...expense,
  //     [name] : isAmountField ? +value : value
  //   })
  // }

  // const handleChangeDate = (value : Value) =>{
  //   //console.log(value)
  //   setExpense({
  //     ...expense,
  //     date: value
  //   })
  // }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    //validar
    // if(Object.values(expense).includes('')){
    //   setError('Todos los campos son obligatorios')
    //   return
    // }

    // //Validar que no me pase del presupuesto
    // if( (expense.amount-previousAmount) > remainingBudget){
    // if( (expense.amount) > remainingBudget){
    //   setError('Ese gasto es mayor que lo que resta de Presupuesto')
    //   return
    // }

    //Agregar un nuevo gasto o actualizar uno existente
    // if(editingId){
    //   updateExpense({id: editingId, ...expense})
    // }else{
    //   addExpense(expense)
    // }

    //reiniciar el state una vez relleno el gasto
    // setExpense({
    //   amount: 0,
    //   expenseName: '',
    //   category: '',
    //   date: new Date()
    // })
    //setPreviousAmount(0)
  }


    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
      <legend
        className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2"
      // >{editingId ? 'Guardar Cambios' : 'Nuevo gasto'}</legend>
      >Editando nota {editingId}</legend>

      {/* {error && <ErrorMessage>{error}</ErrorMessage>} */}

      {/* <div className="flex flex-col gap-2">
        <label 
          htmlFor="expenseName"
          className="text-xl">
          Nombre Nota:
        </label>
        <input 
          type="text"
          id="expenseName"
          placeholder="Añade el nombre del gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName} 
          onChange={handleChange}
        />
      </div> */}

     

      
      
      <input 
        type="submit" 
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
        value='Guardar cambios'
      />

    </form>
    )
}

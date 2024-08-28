import {useState} from "react";
export default function InventoryPage() {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}> 
        <input>  </input>
    </form>
  )
}
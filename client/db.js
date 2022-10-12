
class DbHandler {

  async GetList() {
    const resp = await fetch("/api/users")
    if (!resp.ok) throw new Error("Error getting list")
    return resp.json()
  }

  async Delete(contact) {
    const resp = await fetch(`/api/users`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify(contact)
    })
    if (!resp.ok) throw new Error("Error deleting contact")
    const id = await resp.text()
    return id
  }

  async Post(contact) {
    const resp = await fetch(`/api/users`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(contact)
    })
    if (!resp.ok) throw new Error("Error creating contact")

    const id = await resp.json()
    return id
  }
}


export default new DbHandler()
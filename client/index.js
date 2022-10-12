import db from "./db.js"


new Vue({
  el: "#app",
  data() {
    return {
      form: {
        name: "",
        value: "",
      },
      contacts: []
    }
  },
  computed: {
    canCreate() {
      return this.form.value.trim() && this.form.name.trim()
    }
  },
  methods: {
    createContact() {
      const { ...contact } = this.form

      db.Post(contact)
        .then(id => {
          this.contacts.push({
            UserName: contact.name,
            UserValue: contact.value,
            Id: id,
            marked: false
          })
        })
        .catch(console.error)

      this.form.name = this.form.value = ""
    },
    markContact(id) {
      const contact = this.contacts.find(c => c.Id === id)
      contact.marked = !contact.marked
    },
    removeContact(id) {
      const contact = this.contacts.find(c => c.Id === id)
      db.Delete(contact)
        .then(data => {
          this.contacts = this.contacts.filter(c => c.Id !== id)
        })
        .catch(console.error)
    }
  },
  async mounted() {
    const contacts = await db.GetList()
    for (let c of contacts) {
      c["marked"] = false
    }
    this.contacts = contacts
  }
})
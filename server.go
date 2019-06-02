package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"log"
	"sync"
)
import "net/http"

type Response struct {
	Message string `json:"message"`
	Status  bool   `json:"status"`
	IsValid bool   `json:"isValid"`
}

var Users = struct {
	m map[string]User
	sync.RWMutex
}{m: make(map[string]User)}

type User struct {
	Username string
}

func HelloWorld(w http.ResponseWriter, r *http.Request) {
	_, _ = w.Write([]byte("hello world"))
}

func HelloJson(w http.ResponseWriter, r *http.Request) {
	res := CreateResponse("hello json", true)
	_ = json.NewEncoder(w).Encode(res)
}

func CreateResponse(message string, isValid bool) Response {
	return Response{message, true, isValid}
}

func main() {

	cssHandle := http.FileServer(http.Dir("./public/css"))
	jsHandle := http.FileServer(http.Dir("./public/js"))

	m := mux.NewRouter()
	m.HandleFunc("/hello", HelloWorld).Methods("GET")
	m.HandleFunc("/helloJson", HelloJson).Methods("GET")
	m.HandleFunc("/static", LoadStatic).Methods("GET")
	m.HandleFunc("/validate", Validate).Methods("POST")

	m.HandleFunc("/chat", WebSocket).Methods("GET")

	http.Handle("/", m)
	http.Handle("/css/", http.StripPrefix("/css/", cssHandle))
	http.Handle("/js/", http.StripPrefix("/js/", jsHandle))
	log.Println("server port 8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}

func WebSocket(w http.ResponseWriter, r *http.Request) {
	//ws, err := websocket.Upgrade(w, r, nil, 1024, 1024)
	//if err != nil {
	//	log.Println(err.Error())
	//}
}

func UserExist(username string) bool {
	Users.RLock()
	defer Users.RUnlock()

	if _, ok := Users.m[username]; ok {
		return true
	}
	return false
}

func Validate(w http.ResponseWriter, r *http.Request) {
	_ = r.ParseForm()
	username := r.FormValue("username")
	res := CreateResponse("Ya existe usuario", false)
	if !UserExist(username) {
		res = CreateResponse("Usuario válido", true)
	}
	_ = json.NewEncoder(w).Encode(res)
}

func LoadStatic(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./public/index.html")
}

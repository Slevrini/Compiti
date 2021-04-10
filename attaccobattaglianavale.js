const express = require("express")
const fetch = require ("node-fetch")
const app = new express()
const PORT = 8000


const team = "Filcol"
const password = "abcd"
let y_max = 0
let x_max = 0
app.use(express.json())

/*
Quando attacco il server mi restituisce un message e uno score.
i message sono: out of field, already hit, water, hit!, killer!
*/

/*

*/
const signup = () => {
    fetch(`http://localhost:8080/signup?team=${team}&password=${password}`)
    .then(res => res.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error))
}
signup()

const check_nave_vert = (field, start_x, start_y) => {
    // console.log("check_nave_vert - start_x=" + start_x + ", start_y=" + start_y)
    let trovato_celle_colpite=false
    for (let row=start_y+1; row < field.length; row++){
        // console.log("   row=" + row)
        // console.log("   field[row][start_x].ship=" + field[row][start_x].ship)
        if (field[row][start_x].ship!==null){
            // console.log("   field[row][start_x].ship.alive=" + field[row][start_x].ship.alive)
            if (field[row][start_x].ship.alive){
                //c'è una cella in basso già colpita contenente una parte di nave
                trovato_celle_colpite=true
            }
        }else{
            // non non è stata colpita e non sappiamo se c'è una nave
            return  [trovato_celle_colpite, row]
        }
    }
    return  [trovato_celle_colpite, field.length-1]
}

const check_nave_orizz = (field, start_x, start_y) => {
    // console.log("check_nave_orizz - start_x=" + start_x + ", start_y=" + start_y)
    let trovato_celle_colpite=false
    for (let col=start_x+1; col < field[start_y].length; col++){
        if (field[start_y][col].ship!==null){
            if (field[start_y][col].ship.alive){
                //c'è una cella in basso già colpita contenente una parte di nave
                trovato_celle_colpite=true
            }
        }else{
            // non non è stata colpita e non sappiamo se c'è una nave
            return  [trovato_celle_colpite, col]
        }
    }
    return  [trovato_celle_colpite, field[start_y].length-1]
}

const find_cell_to_shot = (field) => {
    y_max = field.length - 1
    x_max = field[0].length - 1
    //console.log("y_max:" + y_max + "; x_max=" + x_max)

    // verifico se ci sono celle con parti di navi già colpite
    for (let row=0; row < field.length; row++){
        //console.log("row:" + row)
        for (let i=0; i< field[0].length; i++){
            //console.log("i:" + i)
            if (field[row][i].ship && field[row][i].ship.alive){
                //console.log("field[row][i].ship && field[row][i].ship.alive:" + field[row][i].ship && field[row][i].ship.alive)
                // trovato cella colpita con nave non affondata
                // controllo se ci sono celle adiacenti già colpite in basso
                chk_vert = check_nave_vert(field, i, row)
                if (chk_vert[0]){
                    // restituisco la cella [chk_vert[1], i] in cui sparare
                    // console.log("chk_vert - chk_vert[1]=" + chk_vert[1] + ", i=" + i)
                    if (!field[chk_vert[1]][i].hit)
                        return [chk_vert[1], i]
                }

                // controllo se ci sono celle adiacenti già colpite a dx
                chk_orizz = check_nave_orizz(field, i, row)
                if (chk_orizz[0]){
                    // restituisco la cella [row, chk_orizz[1]] in cui sparare
                    // console.log("chk_orizz - row=" + row + ", chk_orizz[1]=" + chk_orizz[1])
                    if (!field[row][chk_orizz[1]].hit)
                        return [row, chk_orizz[1]]
                }

                // non ci sono celle adiacenti alla cella [row,i] contenenti una parte di nave già colpita
                // colpisco a caso la prima possibile tra le quattro adiacenti a quella trovata
                if (row>0)
                    if (!field[row-1][i].hit)
                        return [row-1, i]
                if (row<y_max)
                    if (!field[row+1][i].hit)
                        return [row+1, i]
                if (i>0)
                    if (!field[row][i-1].hit)
                        return [row, i-1]
                if (i<x_max)
                    if (!field[row][i+1].hit)
                        return [row, i+1]
            }
        }
    }

    // non ci sono celle contenenti parti di navi già colpite, sparo in cella a caso
    for (let row=0; row < field.length; row++){
        for (let i=0; i< field[0].length; i++){
            if (!field[row][i].hit){
                return [row, i]
            }
        }
    }
}


const get_field = () => {
    fetch("http://localhost:8080/?format=json")
    .then(res => res.json())
    .then(data => {
        const ships = data.ships.every(s => !s.alive)
        if (ships){
            console.log("Partita finita!")
            return false
        }


        //const field = data.field.filter(cells => !cells.hit)
        const field = data.field
        //console.log(field)
        

        if (field.length > 0){
            cell2shot = find_cell_to_shot(field)
            //console.log("cell2shot[0],[cell2shot[1] : " + cell2shot[0] + "," + cell2shot[1])
            const cell = field[cell2shot[0]][cell2shot[1]]
            //console.log(cell)
            fire(cell)
            return true
        }
    })
    .catch(error => console.error('Error:', error))
}


const fire = (cell) => {
    console.log("Shot in cell y=" + cell.y + "; x=" + cell.x)
    //console.log(cell)
    // fetch("http://localhost:8080/fire", {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     body: JSON.stringify({
    //         x: cell.x,
    //         y: cell.y,
    //         team: team,
    //         password: password
    //     })
    // })

    fetch(`http://localhost:8080/fire?x=${cell.x}&y=${cell.y}&team=${team}&password=${password}`)
    .then(res => res.json())
    .then(data => console.log(data.message, ", punteggio: ", data.score))
    .catch(error => console.error('Error:', error))
}


setInterval(get_field, 10)


// app.get("/", (req,res) => {
//     res.send(get_field())
// })


app.listen(PORT, () => console.log("App listening on port %O", PORT))

const express = require('express');
const fs = require('fs');
const axios = require('axios');
const connection = require('./database/connection');

const api = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/pokemon'
});

const app = express();

app.get('/', async (request, response) => {
    try {
        // [0] id [1] Name, [2] Type 1, [3] Type 2, [4]Total, [5]HP, [6]Attack, [7]Defense, [8]Sp. Atk, [9]Sp. Def, [10]Speed, [11]Generation, [12]Legendary
        var data = fs.readFileSync('./pokemon.csv')
                                    .toString() // convert Buffer to string
                                    .split('\n') // split string to lines
                                    .map(e => e.trim()) // remove white spaces for each line
                                    .map(e => e.split(',').map(e => e.trim())); // split each line to array



        // api.get('/' + data[0][0]).then(response => {
        //     console.log(response.data.sprites.front_default);
        // }) ;
        
        
        for(var i = 0, ln = data.length; i < ln; i ++) {
            
            let id = data[i][0];
            let name = data[i][1];
            let type1 = data[i][2];
            let type2 = data[i][3];
            let generation = data[i][11];
            let legendary = data[i][12] == 'True';
            let img_front = '';
            let img_back = '';

            let [existePokemon] = await connection('pokemons').where('id', id).count();

            if(existePokemon['count(*)'] <= 0){
                await api.get('/' + id).then(response => {
                    img_front = response.data.sprites.front_default;
                    img_back = response.data.sprites.back_default;
                }) ;

                await connection('pokemons').insert({
                        id,
                        name,
                        type1,
                        type2,
                        legendary,
                        generation,
                        img_front,
                        img_back
                    });
            }
        }
        
        return response.send('Pokemons Ok');
    } catch (error) {
        return response.status(400).json({errorMessage: error});
    }

} );

app.get('/attributes', async (request, response) => {

    try {
            
        

        // [0] id [1] Name, [2] Type 1, [3] Type 2, [4]Total, [5]HP, [6]Attack, [7]Defense, [8]Sp. Atk, [9]Sp. Def, [10]Speed, [11]Generation, [12]Legendary
        var data = fs.readFileSync('./pokemon.csv')
                                    .toString() // convert Buffer to string
                                    .split('\n') // split string to lines
                                    .map(e => e.trim()) // remove white spaces for each line
                                    .map(e => e.split(',').map(e => e.trim())); // split each line to array

        for(var i = 0, ln = data.length; i < ln; i ++) {

            let pokemon_id = data[i][0];
            let total      = data[i][4];
            let hp         = data[i][5];
            let attack     = data[i][6];
            let defense    = data[i][7];
            let sp_atk     = data[i][8];
            let sp_def     = data[i][9];
            let speed      = data[i][10];


            let [existePokemon] = await connection('attributes').where('pokemon_id', pokemon_id).count();

            if(existePokemon['count(*)'] <= 0){
                await connection('attributes').insert({
                    total,
                    hp,
                    attack,
                    defense,
                    sp_atk,
                    sp_def,
                    speed,
                    pokemon_id
                });
            }

            console.log('inserido')

        }

        // table.decimal('total');
        //     table.decimal('hp');
        //     table.decimal('attack');
        //     table.decimal('defense');
        //     table.decimal('sp-atk');
        //     table.decimal('sp-def');
        //     table.decimal('speed');

        //     table.integer('pokemon_id').notNullable();

        return response.send('Attr Ok');
    } catch (error) {
        return response.status(400).json({errorMessage: error});
    }

    
} );

app.listen(3333);
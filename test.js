const bell = (graph, V, E, src) => {
    let distance = Array(V).fill(1000000000);
    distance[src] = 0;

    for(let i = 0; i < V - 1; i++){
        for(let j = 0; j < E; j++){
            if(distance[graph[j][0]] + graph[j][2] < distance[graph[j][1]])
                distance[graph[j][1]] = distance[graph[j][0]] + graph[j][2];
        }
    }

    for(let i = 0; i < E; i++){
        let x = graph[i][0];
        let y = graph[i][1];
        let weight = graph[i][2];
        if((distance[x] != 1000000000) && (distance[x] + weight < distance[y]))
            console.log("Graph has a negative weight cycle");
    }

    for(let i = 0; i < V; i++)
        console.log("Distance = ", distance[i]);
}

let V = 5;
let E = 8;

let graph = [[ 0, 1, -1 ], [ 0, 2, 4 ],
                [ 1, 2, 3 ], [ 1, 3, 2 ],
                [ 1, 4, 2 ], [ 3, 2, 5 ],
                [ 3, 1, 1 ], [ 4, 3, -3 ]];

console.log(bell(graph, V, E, 0));

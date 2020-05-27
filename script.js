const cases = {
    "vide": {
        "background": "red",
    },

    "inaccessible": {
        "background": "black",
    },
}

function generer(){

    let choixCases = `
    <h5 class="pl-3 pr-3 mb-3">Voici votre jeu de plateau : niveau facile</h5>
    <table class="table w-75 pl-3 pr-3 mb-3">
    <tbody>`;
    for (let ligne=1; ligne<=6; ligne++){
        choixCases += '<tr>';
        for (let colonne=1; colonne<=6; colonne++){
            choixCases += '<td>';
            choixCases += '</td>';
        }
        choixCases += '</tr>';
    }     
    /*<tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <th scope="row">5</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
            <tr>
              <th scope="row">6</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>*/

    document.getElementById("case").innerHTML = choixCases;
}

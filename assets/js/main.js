document.getElementById('formularioBusqueda').addEventListener('submit', function (event) {
    event.preventDefault();


    /* const HTMLResponse = document.querySelector('#app') */

    let reg = /^\d+$/;
    let valueInput = document.getElementById('idSuperHero').value;
    /* $('#idSuperHero').val() */


    if (reg.test(valueInput) && 1 <= valueInput && valueInput <= 732) {



        fetch(`https://www.superheroapi.com/api.php/10226918880178853/${valueInput}`).then(response => response.json()).then(superHero => {

            let nombre = superHero.name;
            let imagen = superHero.image.url;
            let peso = superHero.appearance.weight[1];
            let estatura = superHero.appearance.height[1];
            let especie = superHero.appearance.race;
            let genero = superHero.appearance.gender;
            let publicado = superHero.biography.publisher;
            let base = superHero.work.base;
            let colorPelo = superHero.appearance["hair-color"];
            let colorOjos = superHero.appearance["eye-color"];
            let nombreReal = superHero.biography["full-name"];

            document.querySelector('.espacioImagen').setAttribute('src', `${imagen}`);
            document.querySelector('.espacioImagen').setAttribute('id', `imgSuperHero`);

            document.getElementById("infoNombre").innerHTML = `${nombre}`
            document.getElementById("infPeso").innerHTML = `${peso}`
            document.getElementById("infEstatura").innerHTML = `${estatura}`
            document.getElementById('infGenero').innerHTML = `${genero}`
            document.getElementById('infEspecie').innerHTML = `${especie}`
            document.getElementById('infPublicado').innerHTML = `${publicado}`
            document.getElementById('infBase').innerHTML = `${base}`
            document.getElementById('infPelo').innerHTML = `${colorPelo}`
            document.getElementById('infOjos').innerHTML = `${colorOjos}`
            document.getElementById('infNombreReal').innerHTML = `${nombreReal}`


            document.getElementById('statSuperHero').style.display = 'block'

            document.getElementById('infoSuperHero').style.display = 'block';

            //Gráfico de barras
            am4core.ready(function () {

                // Themes begin
                am4core.useTheme(am4themes_animated);
                // Themes end

                /**
                 * Chart design taken from Samsung health app
                 */

                var chart = am4core.create("chartdiv", am4charts.XYChart);
                chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

                chart.paddingRight = 40;

                chart.data = [{
                    "name": "Inteligencia",
                    "steps": `${superHero.powerstats.intelligence}`,
                    "href": "assets/img/int.svg"
                }, {
                    "name": "Fuerza",
                    "steps": `${superHero.powerstats.strength}`,
                    "href": "assets/img/fuerza.svg"
                }, {
                    "name": "Velocidad",
                    "steps": `${superHero.powerstats.speed}`,
                    "href": "assets/img/velocidad.svg"
                }, {
                    "name": "Resistencia",
                    "steps": `${superHero.powerstats.durability}`,
                    "href": "assets/img/resistencia.svg"
                }, {
                    "name": "Poder",
                    "steps": `${superHero.powerstats.power}`,
                    "href": "assets/img/rayo.svg"
                }, {
                    "name": "Combate",
                    "steps": `${superHero.powerstats.combat}`,
                    "href": "assets/img/combate.svg"
                }];

                var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "name";
                categoryAxis.renderer.grid.template.strokeOpacity = 0;
                categoryAxis.renderer.minGridDistance = 10;
                categoryAxis.renderer.labels.template.dx = -40;
                categoryAxis.renderer.minWidth = 120;
                categoryAxis.renderer.tooltip.dx = -40;

                var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
                valueAxis.renderer.inside = true;
                valueAxis.renderer.labels.template.fillOpacity = 0.3;
                valueAxis.renderer.grid.template.strokeOpacity = 0;
                valueAxis.min = 0;
                valueAxis.max = 100;
                valueAxis.cursorTooltipEnabled = false;
                valueAxis.renderer.baseGrid.strokeOpacity = 0;
                valueAxis.renderer.labels.template.dy = 20;

                var series = chart.series.push(new am4charts.ColumnSeries);
                series.dataFields.valueX = "steps";
                series.dataFields.categoryY = "name";
                series.tooltipText = "{valueX.value}";
                series.tooltip.pointerOrientation = "vertical";
                series.tooltip.dy = - 30;
                series.columnsContainer.zIndex = 100;

                var columnTemplate = series.columns.template;
                columnTemplate.height = am4core.percent(50);
                columnTemplate.maxHeight = 40;
                columnTemplate.column.cornerRadius(60, 10, 60, 10);
                columnTemplate.strokeOpacity = 0;

                series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueX", min: am4core.color("#F2E205"), max: am4core.color("#F29F05") });
                series.mainContainer.mask = undefined;

                var cursor = new am4charts.XYCursor();
                chart.cursor = cursor;
                cursor.lineX.disabled = true;
                cursor.lineY.disabled = true;
                cursor.behavior = "none";

                var bullet = columnTemplate.createChild(am4charts.CircleBullet);
                bullet.circle.radius = 20;
                bullet.valign = "middle";
                bullet.align = "left";
                bullet.isMeasured = true;
                bullet.interactionsEnabled = false;
                bullet.horizontalCenter = "right";
                bullet.interactionsEnabled = false;

                var hoverState = bullet.states.create("hover");
                var outlineCircle = bullet.createChild(am4core.Circle);
                outlineCircle.adapter.add("radius", function (radius, target) {
                    var circleBullet = target.parent;
                    return circleBullet.circle.pixelRadius + 7;
                })

                var image = bullet.createChild(am4core.Image);
                image.width = 40;
                image.height = 40;
                image.horizontalCenter = "middle";
                image.verticalCenter = "middle";
                image.propertyFields.href = "href";

                image.adapter.add("mask", function (mask, target) {
                    var circleBullet = target.parent;
                    return circleBullet.circle;
                })

                var previousBullet;
                chart.cursor.events.on("cursorpositionchanged", function (event) {
                    var dataItem = series.tooltipDataItem;

                    if (dataItem.column) {
                        var bullet = dataItem.column.children.getIndex(1);

                        if (previousBullet && previousBullet != bullet) {
                            previousBullet.isHover = false;
                        }

                        if (previousBullet != bullet) {

                            var hs = bullet.states.getKey("hover");
                            hs.properties.dx = dataItem.column.pixelWidth;
                            bullet.isHover = true;

                            previousBullet = bullet;
                        }
                    }
                })

            }); // end am4core.ready()

        })



        //Limpia formulario
        document.getElementById("formularioBusqueda").reset();


    } else {
        alert("Debe ingresar un número entre 1 y 732")
        document.getElementById("formularioBusqueda").reset();
    };

})












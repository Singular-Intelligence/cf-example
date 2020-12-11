import React, {
    useEffect,
    useState,
} from 'react';
import * as d3 from "d3";
import * as dc from "dc";
import * as crossfilter from "crossfilter";

export const CFExample = ({csvName}) => {

    const loadData = async (name) => {
        const chart = dc.barChart("#test")
        const newData = await d3.csv(name).then(
            (experiments) => {

                experiments.forEach((x) => x.Speed = +x.Speed)

                const ndx = crossfilter(experiments)
                const runDimension = ndx.dimension(d => +d.Run)
                const speedSumGroup = runDimension.group().reduceSum(d => d.Speed * d.Run / 1000)

                chart
                    .width(768)
                    .height(480)
                    .x(d3.scaleLinear().domain([6,20]))
                    .brushOn(false)
                    .yAxisLabel("This is the Y Axis!")
                    .dimension(runDimension)
                    .group(speedSumGroup)
                    .on('renderlet', chart => {
                        chart
                            .selectAll('rect')
                            .on("click", d => console.log("click!"))
                    });

                chart.render();

            }
        )
    }

    useEffect(
        () => loadData(csvName),
        [csvName]
    )

    return <div>
        <p>hello</p>
        <div id="test" />
    </div>
}

import React, {useEffect, useState} from "react";
import EnhancedTable from "./ProductList";
import Products from "../../api/product";
import {Grid} from "@mui/material";
import AddProduct from "./AddProduct";
import DeleteProducts from "./DeleteProducts";

const AllProducts = () => {

    const [data, allData] = useState<any>([])

    const [limit, setLimit] = useState(10)
    const [nextToken, setFrom] = useState(0)
    const [total, seTotal] = useState(0)

    console.log("helo world", limit, nextToken, data)
    let updateFrom = (l: number, nt:number) => {
        setLimit(l)
        setFrom(nt*l)
    }

    const getData = (lim: number, token: number) => {
        return Products.getAllProducts(lim, token)
    }

    useEffect(() => {
        getData(limit, nextToken).then(r => {
            allData(r.data.data)
            seTotal(r.data.totalItems)
            // setFrom(r.data.nextToken)
        })
    }, [])

    useEffect(() => {
    }, [])


    console.log(data)
    return (
        <Grid container spacing={2}>
            <Grid item lg={12}>
                {data && <EnhancedTable data={data} limit={limit} updateFrom={updateFrom} total={total}/>}
            </Grid>


        </Grid>
    )
}
export default AllProducts
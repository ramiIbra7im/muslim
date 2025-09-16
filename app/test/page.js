"use client"
import { toast } from "react-toastify";

function Test() {
    const number = [1, 2, 3, 4]
    const test = [
        { id: 1, name: "rami" },
        { id: 2, name: "bassant" },
        { id: 3, name: "bassant" },
        { id: 4, name: "bassant" },
        { id: 5, name: "bassant" },
    ]
    const Handleclick = (num) => {
        toast.success(`ضغط علي الرقم :${num}`)
    }
    return (
        <>
            <h1>Welcom Test</h1>
            <div className=" col-sm-12 col-lg-8  shadow  m-auto">
                {number.map((num, index) => (
                    <div key={index} className=" border p-3 gap-3 card m-2 " onClick={() => Handleclick(num)}>{num}</div>
                ))}
                <h2 className="text-center fw-bold ">map 2</h2>
                <div className="row gap-1 m-0">
                    {test.map((i) => (
                        <div key={i.id} className="  m-0 gap-2  p-0 col-md-4 ">
                            <div className=" card p-2" >{i.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )

}
export default Test
import MenuAppBar from "../../components/app-bar/app-bar";

const About = () => {
    return (
        <div style={{ display: "flex", flexWrap: "nowrap", minHeight: "100vh", backgroundColor:"#181B19", width:"100%" }}>
            <MenuAppBar />
                <div style={{ display: "flex", flexWrap: "nowrap", width: "50%", flexDirection: "column" , paddingTop:"70px"}}>
                    <h2 style={{color:"#FFFFFF", fontFamily:"Poppins", fontWeight:"500", letterSpacing:"3px"}}>Michali Travels</h2>
                    <hr style={{borderTop:"3px solid #EC8305", fontWeight:"2.5px", gap:"2", width:"30%"}} ></hr>
                </div>
                <div style={{ display: "flex", flexWrap: "nowrap", width: "50%", flexDirection: "column" }}></div>
        </div>
    );
}
export default About;
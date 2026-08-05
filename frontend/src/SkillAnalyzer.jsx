import { useState } from "react";
import "./App.css";


function SkillAnalyzer(){

const [result,setResult]=useState(null);


const [form,setForm]=useState({

user_id:3,

python_level:true,

math_level:"Beginner",

quantum_level:"No Knowledge"

});



function handleChange(e){

setForm({

...form,

[e.target.name]:e.target.value

});

}




function analyze(){


fetch(
"http://127.0.0.1:5000/generate",
{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

}

)

.then(res=>res.json())

.then(data=>{

setResult(data);

});


}




return(

<div className="card">


<h3>
🧠 AI Skill Analyzer
</h3>



<label>
Python Knowledge
</label>

<select
name="python_level"
onChange={handleChange}
>

<option value={true}>
Completed
</option>

<option value={false}>
Beginner
</option>

</select>



<label>
Mathematics Level
</label>

<select
name="math_level"
onChange={handleChange}
>

<option>
Beginner
</option>

<option>
Intermediate
</option>

<option>
Advanced
</option>

</select>




<label>
Quantum Knowledge
</label>


<select
name="quantum_level"
onChange={handleChange}
>

<option>
No Knowledge
</option>

<option>
Beginner
</option>

<option>
Intermediate
</option>

</select>



<button
onClick={analyze}
>

🚀 Analyze My Skills

</button>




{
result &&

<div>

<h4>
📊 Analysis
</h4>


<p>
Readiness:
{result.skill_analysis.readiness}
</p>



<h4>
📚 Missing Skills
</h4>


<p>
{
result.skill_analysis["Missing Skills"].join(", ")
}
</p>


<h4>
🎯 Roadmap
</h4>


{
result.recommended_roadmap.Beginner.map(
(skill,index)=>(

<p key={index}>
{index+1}. {skill}
</p>

)

)

}



</div>

}



</div>


)

}


export default SkillAnalyzer;
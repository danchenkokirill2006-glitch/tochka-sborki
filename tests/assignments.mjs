import assert from 'node:assert/strict'
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, basename } from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
const dir=await mkdtemp(join(tmpdir(),'tochka-rubric-'))
try {
  for(const name of ['assignments','task-assets','task-layouts']) {
    const source=await readFile(new URL(`../src/${name}.ts`,import.meta.url),'utf8')
    const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText.replace(/from '\.\/(assignments|task-assets)'/g,"from './$1.mjs'")
    await writeFile(join(dir,name+'.mjs'),js)
  }
  const {projects,starterFor,evaluateProject,meaningfulChanges}=await import(pathToFileURL(join(dir,'assignments.mjs')))
  const {makeBaseObjects,makeReferenceObjects}=await import(pathToFileURL(join(dir,'task-layouts.mjs')))
  const backgrounds={composition:'#f0ede6',hierarchy:'#f2efe9',balance:'#141720',rhythm:'#efe9dd',color:'#f4f1e8',grid:'#f4f3ef'}
  for(const id of Object.keys(projects)) {
    const reference=makeReferenceObjects(id),base=makeBaseObjects(id),starter=starterFor(id,reference)
    const check=objects=>evaluateProject(id,objects,starter,backgrounds[id],[reference,base])
    assert.equal(check(starter).passed,false,id+' starter')
    assert.equal(check(starter).unchanged,true,id+' identified')
    assert.ok(check(starter).score<=49,id+' capped')
    assert.equal(check(reference).passed,false,id+' previous starter')
    assert.equal(check(base).passed,false,id+' oldest starter')
    const normalized=starter.map((v,i)=>({...v,id:'new-'+i,name:'renamed',opacity:1,fontFamily:v.fontFamily??'Manrope',height:v.type==='text'?v.height+20:v.height,color:v.color?.toUpperCase()}))
    assert.equal(meaningfulChanges(normalized,starter),0,id+' normalization is not progress')
    assert.equal(check(normalized).passed,false,id+' renamed source')
    const tiny=starter.map((v,i)=>({...v,x:v.x+(i===0?1:0)}))
    assert.equal(check(tiny).passed,false,id+' one pixel')
    const single=starter.map((v,i)=>({...v,x:v.x+(i===0?30:0)}))
    assert.equal(check(single).passed,false,id+' single edit')
    // A deliberately authored solution, not supplied to learners as a finished answer.
    const solution=reference.map(v=>({...v,x:24}))
    if(id==='color')solution.forEach(v=>{if(v.type==='text')v.color='#263d2b';if(v.type==='shape')v.background='#e8a83e'})
    if(id==='rhythm')solution.filter(v=>v.type==='text').forEach(v=>v.color='#202a22')
    if(id==='rhythm')solution.filter(v=>v.id.startsWith('r-beat')).forEach((v,i)=>Object.assign(v,{x:24+i*102,width:68,height:22,background:i===2?'#e1623b':'#202a22'}))
    if(id==='balance')solution.forEach(v=>{if(['b-djs','b-accent','b-logo'].includes(v.id))v.x=432})
    if(id==='grid')solution.filter(v=>v.id.startsWith('g-schedule-')&&v.id!=='g-schedule-title').forEach((v,i)=>{v.y=630+i*40})
    // Keep the original safe horizontal separation for small footer marks and columns.
    solution.forEach(v=>{if(v.materialKind==='logo')v.x=432;if(id==='hierarchy'&&v.id==='h-photo')v.x=330;if(id==='hierarchy'&&v.id==='h-free')v.x=392;if(id==='rhythm'&&v.id==='r-program')v.x=343;if(id==='grid'&&v.id==='g-site')v.x=432})
    const result=check(solution)
    console.log(id,JSON.stringify({starter:check(starter).score,solution:result.score,passed:result.passed,blockers:result.blockers,craft:result.items[1]}))
    assert.equal(result.passed,true,id+' valid solution')
    const missing=solution.filter(v=>v.type!=='text'&&v.type!=='date')
    assert.equal(check(missing).passed,false,id+' missing information')
    const hidden=solution.map(v=>({...v,opacity:.1}))
    assert.equal(check(hidden).passed,false,id+' invisible content')
    const badContrast=solution.map(v=>({...v,color:v.type==='text'?backgrounds[id]:v.color}))
    assert.equal(check(badContrast).passed,false,id+' illegible text')
    const movedOff=solution.map(v=>({...v,x:v.x+1000}))
    assert.equal(check(movedOff).passed,false,id+' off canvas')
  }
  console.log('All six exercises: source, legacy, normalization, trivial edit, valid solution, missing and hidden content passed.')
} finally { assert.equal(resolve(dir),join(resolve(tmpdir()),basename(dir)));assert.ok(basename(dir).startsWith('tochka-rubric-'));await rm(dir,{recursive:true,force:true}) }


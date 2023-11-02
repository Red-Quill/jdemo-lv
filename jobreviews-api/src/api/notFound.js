// for health checks (e.g. AWS load balancers)

const notFound = async(request,response) => response.status(404).send("Requested path doesn't exist on the API");



export default notFound;
